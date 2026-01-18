import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link'],
    ['clean']
  ],
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'align',
  'link'
];

export function PrivacyPolicyManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [content, setContent] = useState('');

  const { data: privacyData, isLoading } = useQuery({
    queryKey: ['privacy-policy-content-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('privacy_policy_content')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    if (privacyData) {
      setContent(privacyData.content || '');
    }
  }, [privacyData]);

  const saveMutation = useMutation({
    mutationFn: async (newContent: string) => {
      if (privacyData?.id) {
        // Update existing record
        const { error } = await supabase
          .from('privacy_policy_content')
          .update({ content: newContent, updated_at: new Date().toISOString() })
          .eq('id', privacyData.id);
        
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('privacy_policy_content')
          .insert({ content: newContent });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['privacy-policy-content-admin'] });
      queryClient.invalidateQueries({ queryKey: ['privacy-policy-content'] });
      toast({ title: 'Privacy Policy saved successfully!' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error saving content', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  const handleSave = () => {
    saveMutation.mutate(content);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Privacy Policy Editor</span>
          <Button onClick={handleSave} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="min-h-[400px]">
          <style>{`
            .privacy-editor .ql-container {
              min-height: 350px;
              font-size: 16px;
            }
            .privacy-editor .ql-editor {
              min-height: 350px;
            }
          `}</style>
          <div className="privacy-editor">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={quillModules}
              formats={quillFormats}
              placeholder="Enter your Privacy Policy content here..."
            />
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          This content will be displayed on the public Privacy Policy page.
        </p>
      </CardContent>
    </Card>
  );
}

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { BlogEditor } from './BlogEditor';
import { AIBlogGenerator } from './AIBlogGenerator';
import { BlogShareButton } from '@/components/blog/BlogShareButton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  published_date: string;
  status: string;
  created_at: string;
}

type ViewMode = 'list' | 'editor' | 'ai-generator';

export function BlogManager() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [aiGeneratedContent, setAiGeneratedContent] = useState<{
    title: string;
    content: string;
    excerpt: string;
  } | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: blogs, isLoading } = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Blog[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('blogs').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast({ title: '✅ Blog deleted successfully' });
      setDeleteId(null);
    },
    onError: (error: any) => {
      toast({ title: '❌ Error', description: error.message, variant: 'destructive' });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const newStatus = status === 'published' ? 'draft' : 'published';
      const { error } = await supabase
        .from('blogs')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast({ title: '✅ Status updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: '❌ Error', description: error.message, variant: 'destructive' });
    },
  });

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setAiGeneratedContent(null);
    setViewMode('editor');
  };

  const handleCloseEditor = () => {
    setViewMode('list');
    setEditingBlog(null);
    setAiGeneratedContent(null);
  };

  const handleAIGenerated = (data: { title: string; content: string; excerpt: string }) => {
    setAiGeneratedContent(data);
    setEditingBlog(null);
    setViewMode('editor');
  };

  if (viewMode === 'ai-generator') {
    return (
      <AIBlogGenerator 
        onClose={() => setViewMode('list')}
        onBlogGenerated={handleAIGenerated}
      />
    );
  }

  if (viewMode === 'editor') {
    return (
      <BlogEditor 
        blog={editingBlog} 
        onClose={handleCloseEditor}
        initialContent={aiGeneratedContent || undefined}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Blog Manager</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setViewMode('ai-generator')}>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate with AI
          </Button>
          <Button onClick={() => {
            setEditingBlog(null);
            setAiGeneratedContent(null);
            setViewMode('editor');
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Blog
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : blogs && blogs.length > 0 ? (
        <div className="grid gap-4">
          {blogs.map((blog) => (
            <Card key={blog.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    {blog.featured_image && (
                      <img
                        src={blog.featured_image}
                        alt={blog.title}
                        className="w-20 h-14 object-cover rounded"
                      />
                    )}
                    <div>
                      <CardTitle className="text-lg">{blog.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        /{blog.slug} • {format(new Date(blog.published_date), 'dd MMM yyyy')}
                      </p>
                    </div>
                  </div>
                  <Badge variant={blog.status === 'published' ? 'default' : 'secondary'}>
                    {blog.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 justify-end">
                  {/* Share Button - only for published blogs */}
                  {blog.status === 'published' && (
                    <BlogShareButton blogSlug={blog.slug} blogTitle={blog.title} />
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleStatusMutation.mutate({ id: blog.id, status: blog.status })}
                  >
                    {blog.status === 'published' ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-1" />
                        Unpublish
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-1" />
                        Publish
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(blog)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteId(blog.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground mb-4">No blogs yet. Create your first blog post!</p>
            <div className="flex justify-center gap-2">
              <Button variant="outline" onClick={() => setViewMode('ai-generator')}>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate with AI
              </Button>
              <Button onClick={() => {
                setEditingBlog(null);
                setAiGeneratedContent(null);
                setViewMode('editor');
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Create Blog
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The blog will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

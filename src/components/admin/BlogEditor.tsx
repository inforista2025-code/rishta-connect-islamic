import { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, Sparkles, Loader2, Image as ImageIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BlogEditorProps {
  blog?: {
    id: string;
    title: string;
    slug: string;
    content?: string;
    excerpt?: string | null;
    featured_image?: string | null;
    status: string;
    seo_meta_title?: string | null;
    seo_meta_description?: string | null;
  } | null;
  onClose: () => void;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function BlogEditor({ blog, onClose }: BlogEditorProps) {
  const [title, setTitle] = useState(blog?.title || '');
  const [slug, setSlug] = useState(blog?.slug || '');
  const [content, setContent] = useState(blog?.content || '');
  const [excerpt, setExcerpt] = useState(blog?.excerpt || '');
  const [featuredImage, setFeaturedImage] = useState(blog?.featured_image || '');
  const [status, setStatus] = useState(blog?.status || 'draft');
  const [seoTitle, setSeoTitle] = useState(blog?.seo_meta_title || '');
  const [seoDescription, setSeoDescription] = useState(blog?.seo_meta_description || '');
  const [uploading, setUploading] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch full blog content if editing
  const { data: fullBlog } = useQuery({
    queryKey: ['blog-edit', blog?.id],
    queryFn: async () => {
      if (!blog?.id) return null;
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', blog.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!blog?.id,
  });

  useEffect(() => {
    if (fullBlog) {
      setContent(fullBlog.content || '');
      setExcerpt(fullBlog.excerpt || '');
      setSeoTitle(fullBlog.seo_meta_title || '');
      setSeoDescription(fullBlog.seo_meta_description || '');
    }
  }, [fullBlog]);

  useEffect(() => {
    if (!blog && title) {
      setSlug(generateSlug(title));
    }
  }, [title, blog]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const blogData = {
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 200).replace(/<[^>]*>/g, ''),
        featured_image: featuredImage || null,
        status,
        seo_meta_title: seoTitle || title,
        seo_meta_description: seoDescription || excerpt || content.substring(0, 160).replace(/<[^>]*>/g, ''),
      };

      if (blog?.id) {
        const { error } = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', blog.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('blogs').insert(blogData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast({ title: `✅ Blog ${blog ? 'updated' : 'created'} successfully` });
      onClose();
    },
    onError: (error: any) => {
      toast({ title: '❌ Error', description: error.message, variant: 'destructive' });
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `blog-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setFeaturedImage(data.publicUrl);
      toast({ title: '✅ Image uploaded successfully' });
    } catch (error: any) {
      toast({ title: '❌ Upload failed', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const generateAIImage = async () => {
    if (!title) {
      toast({ title: '❌ Please enter a blog title first', variant: 'destructive' });
      return;
    }

    setGeneratingImage(true);
    try {
      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-3-pro-image-preview',
          messages: [
            {
              role: 'user',
              content: `Generate a soft, Islamic-themed, modest illustration suitable for a matrimonial blog about: ${title}. Use clean colors, pastel tones, respectful tone, no faces, no inappropriate elements. The image should be professional and elegant, suitable for a Muslim matrimony website. Size: 1200x630 pixels, landscape format.`
            }
          ],
          modalities: ['image', 'text']
        })
      });

      const data = await response.json();
      
      if (data.choices?.[0]?.message?.images?.[0]?.image_url?.url) {
        const base64Image = data.choices[0].message.images[0].image_url.url;
        
        // Convert base64 to blob and upload to storage
        const base64Data = base64Image.split(',')[1];
        const binaryData = atob(base64Data);
        const arrayBuffer = new ArrayBuffer(binaryData.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < binaryData.length; i++) {
          uint8Array[i] = binaryData.charCodeAt(i);
        }
        const blob = new Blob([uint8Array], { type: 'image/png' });

        const fileName = `ai-generated-${Date.now()}.png`;
        const filePath = `blog-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(filePath, blob);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('blog-images')
          .getPublicUrl(filePath);

        setFeaturedImage(urlData.publicUrl);
        toast({ title: '✅ AI image generated and uploaded!' });
      } else {
        throw new Error('Failed to generate image');
      }
    } catch (error: any) {
      toast({ 
        title: '❌ Image generation failed', 
        description: error.message, 
        variant: 'destructive' 
      });
    } finally {
      setGeneratingImage(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onClose}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">
          {blog ? 'Edit Blog' : 'Create New Blog'}
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Blog Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter blog title"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug (URL) *</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">/blog/</span>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(generateSlug(e.target.value))}
                    placeholder="blog-url-slug"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Short description for blog listing..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="content">Content * (HTML supported)</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog content here... (HTML tags supported)"
                  rows={15}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  You can use HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;a href=""&gt;
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={() => saveMutation.mutate()} 
                className="w-full"
                disabled={!title || !slug || !content || saveMutation.isPending}
              >
                {saveMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  blog ? 'Update Blog' : 'Create Blog'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {featuredImage && (
                <div className="relative">
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setFeaturedImage('')}
                  >
                    Remove
                  </Button>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-lg hover:border-primary transition-colors">
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </Label>

                <Button
                  variant="outline"
                  onClick={generateAIImage}
                  disabled={generatingImage || !title}
                  className="w-full"
                >
                  {generatingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate AI Image
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="seo-title">Meta Title</Label>
                <Input
                  id="seo-title"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={title || 'SEO title...'}
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {seoTitle.length}/60 characters
                </p>
              </div>

              <div>
                <Label htmlFor="seo-description">Meta Description</Label>
                <Textarea
                  id="seo-description"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="SEO description..."
                  rows={3}
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {seoDescription.length}/160 characters
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

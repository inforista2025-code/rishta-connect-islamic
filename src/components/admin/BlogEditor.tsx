import { useState, useEffect, useRef, useCallback } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, Sparkles, Loader2, Image as ImageIcon, Bold, Italic, Heading2, List, Link2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BlogShareButton } from '@/components/blog/BlogShareButton';
import { cn } from '@/lib/utils';
import { getOptimizedIslamicTopicImage } from './AIBlogGenerator';

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
  initialContent?: {
    title: string;
    content: string;
    excerpt: string;
    featured_image?: string;
    seo_meta_title?: string;
    seo_meta_description?: string;
  };
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function BlogEditor({ blog, onClose, initialContent }: BlogEditorProps) {
  const [title, setTitle] = useState(blog?.title || initialContent?.title || '');
  const [slug, setSlug] = useState(blog?.slug || (initialContent?.title ? generateSlug(initialContent.title) : ''));
  const [content, setContent] = useState(blog?.content || initialContent?.content || '');
  const [excerpt, setExcerpt] = useState(blog?.excerpt || initialContent?.excerpt || '');
  const [featuredImage, setFeaturedImage] = useState(
    blog?.featured_image || initialContent?.featured_image || (initialContent?.title ? getOptimizedIslamicTopicImage(initialContent.title) : '')
  );
  const [status, setStatus] = useState(blog?.status || 'draft');
  const [seoTitle, setSeoTitle] = useState(
    blog?.seo_meta_title || initialContent?.seo_meta_title || (initialContent?.title ? (initialContent.title.length > 60 ? initialContent.title.substring(0, 57) + '...' : initialContent.title) : '')
  );
  const [seoDescription, setSeoDescription] = useState(
    blog?.seo_meta_description || initialContent?.seo_meta_description || (initialContent?.excerpt ? (initialContent.excerpt.length > 160 ? initialContent.excerpt.substring(0, 157) + '...' : initialContent.excerpt) : '')
  );
  const [uploading, setUploading] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [imagePosition, setImagePosition] = useState<'center' | 'top' | 'bottom'>('center');
  
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  
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
      if (fullBlog.featured_image) {
        setFeaturedImage(fullBlog.featured_image);
      }
    }
  }, [fullBlog]);

  useEffect(() => {
    if (!blog && title && !slug) {
      setSlug(generateSlug(title));
    }
  }, [title, blog, slug]);

  const handleTitleChange = (newTitle: string) => {
    const prevTitle = title;
    setTitle(newTitle);
    if (!blog) {
      setSlug(generateSlug(newTitle));
    }
    if (!seoTitle || seoTitle === prevTitle) {
      setSeoTitle(newTitle.length > 60 ? newTitle.substring(0, 57) + '...' : newTitle);
    }
    if (!featuredImage && newTitle.trim()) {
      setFeaturedImage(getOptimizedIslamicTopicImage(newTitle));
    }
  };

  const handleExcerptChange = (newExcerpt: string) => {
    const prevExcerpt = excerpt;
    setExcerpt(newExcerpt);
    if (!seoDescription || seoDescription === prevExcerpt) {
      setSeoDescription(newExcerpt.length > 160 ? newExcerpt.substring(0, 157) + '...' : newExcerpt);
    }
  };

  // Rich text formatting functions
  const insertFormatting = (tag: string, wrapper?: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newText = '';
    if (wrapper) {
      newText = `<${tag}>${selectedText || 'text'}</${tag}>`;
    } else {
      newText = `<${tag}>${selectedText || 'text'}</${tag}>`;
    }
    
    const newContent = content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const autoImage = featuredImage || getOptimizedIslamicTopicImage(title);
      const autoSeoTitle = seoTitle || (title.length > 60 ? title.substring(0, 57) + '...' : title);
      const autoSeoDesc = seoDescription || excerpt || content.substring(0, 150).replace(/<[^>]*>/g, '');

      const blogData = {
        title,
        slug: slug || generateSlug(title),
        content,
        excerpt: excerpt || content.substring(0, 200).replace(/<[^>]*>/g, ''),
        featured_image: autoImage,
        status,
        seo_meta_title: autoSeoTitle,
        seo_meta_description: autoSeoDesc,
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
  const uploadFile = async (file: File) => {
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        await uploadFile(file);
      } else {
        toast({ title: '❌ Please drop an image file', variant: 'destructive' });
      }
    }
  }, []);

  const generateAIImage = async () => {
    if (!title.trim()) {
      toast({ title: '❌ Please enter a blog title first', variant: 'destructive' });
      return;
    }

    setGeneratingImage(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      // Auto-assign ultra-low-KB (~35KB WebP), fast loading, topic-matched Islamic matrimonial image
      const autoImg = getOptimizedIslamicTopicImage(title);
      setFeaturedImage(autoImg);
      toast({ title: '✅ Topic-matched lightweight image (~35KB WebP) applied!' });
    } finally {
      setGeneratingImage(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onClose}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h2 className="text-2xl font-bold">
            {blog ? 'Edit Blog' : 'Create New Blog'}
          </h2>
        </div>
        
        {/* Share Button - only for existing published blogs */}
        {blog?.id && blog.status === 'published' && (
          <BlogShareButton blogSlug={blog.slug} blogTitle={blog.title} />
        )}
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
                  onChange={(e) => handleTitleChange(e.target.value)}
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
                <Label htmlFor="excerpt">Excerpt / Summary</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => handleExcerptChange(e.target.value)}
                  placeholder="Short description for blog listing..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                {/* Formatting Toolbar */}
                <div className="flex flex-wrap gap-1 mb-2 p-2 border rounded-t-md bg-muted/50">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertFormatting('h2')}
                    title="Heading"
                  >
                    <Heading2 className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertFormatting('strong')}
                    title="Bold"
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertFormatting('em')}
                    title="Italic"
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const text = content;
                      setContent(text + '\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>');
                    }}
                    title="List"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const link = prompt('Enter URL:');
                      if (link) {
                        const text = prompt('Enter link text:') || 'Click here';
                        setContent(content + `<a href="${link}">${text}</a>`);
                      }
                    }}
                    title="Link"
                  >
                    <Link2 className="w-4 h-4" />
                  </Button>
                </div>
                <Textarea
                  ref={contentRef}
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog content here... Use the toolbar above for formatting."
                  rows={15}
                  className="font-mono text-sm rounded-t-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use the toolbar or type HTML tags directly. Supported: h2, h3, p, ul, li, strong, em, a
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

          {/* Featured Image with Drag & Drop */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {featuredImage && (
                <div className="space-y-3">
                  <div className="relative border rounded-lg overflow-hidden">
                    <img
                      src={featuredImage}
                      alt="Featured"
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setFeaturedImage('')}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                  
                  {/* Image Position Options */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Image Position</Label>
                    <Select 
                      value={imagePosition} 
                      onValueChange={(value: 'center' | 'top' | 'bottom') => setImagePosition(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top">Top (Logo/Header at top)</SelectItem>
                        <SelectItem value="center">Center (Default)</SelectItem>
                        <SelectItem value="bottom">Bottom (Focus on bottom)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Adjust how the image is cropped on the blog page
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {/* Drag & Drop Zone */}
                <div
                  ref={dropZoneRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer",
                    isDragging 
                      ? "border-primary bg-primary/10" 
                      : "border-muted-foreground/30 hover:border-primary/50",
                    uploading && "opacity-50 pointer-events-none"
                  )}
                >
                  {uploading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground text-center">
                        Drag & drop an image here
                      </p>
                      <p className="text-xs text-muted-foreground">or</p>
                    </>
                  )}
                  
                  <Label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-md hover:bg-secondary/80 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Browse Files</span>
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
                </div>

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

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Share2, Copy, Check, MessageCircle, Facebook, Twitter, Mail, Link2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BlogShareButtonProps {
  blogSlug: string;
  blogTitle: string;
}

export function BlogShareButton({ blogSlug, blogTitle }: BlogShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const blogUrl = `${window.location.origin}/blog/${blogSlug}`;
  const encodedUrl = encodeURIComponent(blogUrl);
  const encodedTitle = encodeURIComponent(blogTitle);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(blogUrl);
      setCopied(true);
      toast({ title: '✅ Link copied to clipboard!' });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ title: '❌ Failed to copy link', variant: 'destructive' });
    }
  };

  const shareLinks = [
    {
      name: 'Copy Link',
      icon: copied ? Check : Copy,
      action: handleCopyLink,
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      name: 'Email',
      icon: Mail,
      href: `mailto:?subject=${encodedTitle}&body=Check out this article: ${encodedUrl}`,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {shareLinks.map((item) => (
          <DropdownMenuItem
            key={item.name}
            onClick={item.action}
            asChild={!!item.href}
          >
            {item.href ? (
              <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center">
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </a>
            ) : (
              <div className="flex items-center cursor-pointer">
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

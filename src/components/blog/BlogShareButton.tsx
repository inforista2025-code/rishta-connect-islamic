import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Share2, Copy, Check, MessageCircle, Facebook, Twitter, Mail, Send, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BlogShareButtonProps {
  blogSlug: string;
  blogTitle: string;
  variant?: 'outline' | 'default' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showText?: boolean;
}

export function BlogShareButton({
  blogSlug,
  blogTitle,
  variant = 'outline',
  size = 'sm',
  className = '',
  showText = true,
}: BlogShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const getBlogUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/blog/${blogSlug}`;
    }
    return `https://rishtamatrimony.vercel.app/blog/${blogSlug}`;
  };

  const blogUrl = getBlogUrl();
  const shareText = `Read this insightful Islamic article on Rishta Matrimony: "${blogTitle}"\n\n`;
  const encodedUrl = encodeURIComponent(blogUrl);
  const encodedTitle = encodeURIComponent(blogTitle);
  const encodedFullShare = encodeURIComponent(`${shareText}${blogUrl}`);

  const handleCopyLink = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(blogUrl);
      } else {
        const input = document.createElement('input');
        input.value = blogUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      toast({
        title: '✅ Link Copied to Clipboard!',
        description: 'You can now paste and share this article anywhere.',
      });
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      toast({
        title: '❌ Failed to copy link',
        description: 'Please copy the URL from your browser address bar.',
        variant: 'destructive',
      });
    }
  };

  const handleNativeShare = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: blogTitle,
          text: `Read this article on Rishta Matrimony: ${blogTitle}`,
          url: blogUrl,
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button
          variant={variant}
          size={size}
          className={`rounded-xl border-border/80 hover:border-primary/50 transition-all duration-200 select-none ${className}`}
          title="Share Article"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-600" />
          ) : (
            <Share2 className="w-4 h-4 text-primary" />
          )}
          {showText && <span className="ml-1.5 text-xs sm:text-sm font-medium">Share</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 rounded-xl shadow-lg border border-border/80 p-1.5 bg-popover"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Quick Copy Link Option */}
        <DropdownMenuItem
          onClick={handleCopyLink}
          className="cursor-pointer font-medium py-2 rounded-lg focus:bg-primary/10 focus:text-primary transition-colors"
        >
          {copied ? (
            <Check className="w-4 h-4 mr-2.5 text-emerald-600" />
          ) : (
            <Copy className="w-4 h-4 mr-2.5 text-foreground/80" />
          )}
          <span>{copied ? 'Link Copied!' : 'Copy Article Link'}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1" />

        {/* WhatsApp Share */}
        <DropdownMenuItem asChild className="cursor-pointer py-2 rounded-lg focus:bg-emerald-50 focus:text-emerald-700">
          <a
            href={`https://api.whatsapp.com/send?text=${encodedFullShare}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-[#25D366] font-medium"
          >
            <MessageCircle className="w-4 h-4 mr-2.5 text-[#25D366]" />
            <span className="text-foreground">Share on WhatsApp</span>
          </a>
        </DropdownMenuItem>

        {/* Telegram Share */}
        <DropdownMenuItem asChild className="cursor-pointer py-2 rounded-lg focus:bg-sky-50 focus:text-sky-700">
          <a
            href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-[#0088cc] font-medium"
          >
            <Send className="w-4 h-4 mr-2.5 text-[#0088cc]" />
            <span className="text-foreground">Share on Telegram</span>
          </a>
        </DropdownMenuItem>

        {/* Facebook Share */}
        <DropdownMenuItem asChild className="cursor-pointer py-2 rounded-lg focus:bg-blue-50 focus:text-blue-700">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-[#1877F2] font-medium"
          >
            <Facebook className="w-4 h-4 mr-2.5 text-[#1877F2]" />
            <span className="text-foreground">Share on Facebook</span>
          </a>
        </DropdownMenuItem>

        {/* Twitter / X Share */}
        <DropdownMenuItem asChild className="cursor-pointer py-2 rounded-lg focus:bg-muted focus:text-foreground">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center font-medium"
          >
            <Twitter className="w-4 h-4 mr-2.5 text-foreground/80" />
            <span className="text-foreground">Share on X (Twitter)</span>
          </a>
        </DropdownMenuItem>

        {/* Email Share */}
        <DropdownMenuItem asChild className="cursor-pointer py-2 rounded-lg focus:bg-muted focus:text-foreground">
          <a
            href={`mailto:?subject=${encodedTitle}&body=Assalamu%20Alaikum,%0A%0ACheck%20out%20this%20article%20on%20Rishta%20Matrimony:%0A${encodedUrl}`}
            className="flex items-center font-medium"
          >
            <Mail className="w-4 h-4 mr-2.5 text-foreground/80" />
            <span className="text-foreground">Share via Email</span>
          </a>
        </DropdownMenuItem>

        {/* Native Mobile Sheet if Supported */}
        {canNativeShare && (
          <>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              onClick={handleNativeShare}
              className="cursor-pointer py-2 rounded-lg text-primary font-medium focus:bg-primary/10"
            >
              <Sparkles className="w-4 h-4 mr-2.5 text-primary" />
              <span>More Options...</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

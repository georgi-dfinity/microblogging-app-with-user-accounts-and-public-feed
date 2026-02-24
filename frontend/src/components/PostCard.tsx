import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { PostWithUsername } from '../hooks/usePosts';
import { Clock, Hash } from 'lucide-react';

interface PostCardProps {
  post: PostWithUsername;
  isOwnPost: boolean;
}

export default function PostCard({ post, isOwnPost }: PostCardProps) {
  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const getTopicLabel = (topic: string) => {
    const labels: Record<string, string> = {
      random: 'Random',
      politics: 'Politics',
      tech: 'Tech'
    };
    return labels[topic] || topic;
  };

  const getTopicVariant = (topic: string): 'default' | 'secondary' | 'outline' => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      random: 'secondary',
      politics: 'default',
      tech: 'outline'
    };
    return variants[topic] || 'secondary';
  };

  const username = post.authorUsername || 'Anonymous';
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-border transition-all duration-200">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary/40 text-primary-foreground font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-semibold text-foreground">{username}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatTimestamp(post.timestamp)}</span>
                </div>
              </div>
              {isOwnPost && (
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  You
                </span>
              )}
            </div>

            <Badge variant={getTopicVariant(post.topic)} className="gap-1">
              <Hash className="h-3 w-3" />
              {getTopicLabel(post.topic)}
            </Badge>

            <p className="text-foreground leading-relaxed whitespace-pre-wrap break-words">
              {post.content}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

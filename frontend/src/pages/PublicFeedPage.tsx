import { useGetPublicFeed } from '../hooks/usePosts';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import PostComposer from '../components/PostComposer';
import PostCard from '../components/PostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare } from 'lucide-react';

export default function PublicFeedPage() {
  const { data: posts, isLoading } = useGetPublicFeed();
  const { identity } = useInternetIdentity();

  const currentUserPrincipal = identity?.getPrincipal().toString();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">The Feed</h2>
        <p className="text-muted-foreground">
          A collection of thoughts from the shadows
        </p>
      </div>

      <PostComposer />

      <div className="space-y-4">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3 p-6 rounded-lg border border-border/50 bg-card/50">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </>
        ) : posts && posts.length > 0 ? (
          posts.map((post, index) => (
            <PostCard 
              key={`${post.timestamp}-${index}`} 
              post={post}
              isOwnPost={currentUserPrincipal ? post.author.toString() === currentUserPrincipal : false}
            />
          ))
        ) : (
          <div className="text-center py-16 space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-accent/50 flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No posts yet</h3>
              <p className="text-muted-foreground">
                Be the first to share something with the world
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

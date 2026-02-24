import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Post } from '../backend';

export interface PostWithUsername extends Post {
  authorUsername: string | null;
}

export function useGetPublicFeed() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PostWithUsername[]>({
    queryKey: ['publicFeed'],
    queryFn: async () => {
      if (!actor) return [];
      const posts = await actor.getPublicFeed();
      
      // Resolve usernames for all posts
      const postsWithUsernames = await Promise.all(
        posts.map(async (post) => {
          try {
            const username = await actor.getUsername(post.author);
            return {
              ...post,
              authorUsername: username,
            };
          } catch (error) {
            console.error('Error fetching username for post author:', error);
            return {
              ...post,
              authorUsername: null,
            };
          }
        })
      );
      
      return postsWithUsernames;
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, topic }: { content: string; topic: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPost(content, topic);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicFeed'] });
    },
  });
}

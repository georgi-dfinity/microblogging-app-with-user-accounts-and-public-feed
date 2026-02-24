import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCreatePost } from '../hooks/usePosts';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

export default function PostComposer() {
  const { identity } = useInternetIdentity();
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState<string>('random');
  const createPost = useCreatePost();

  const isAuthenticated = !!identity;
  const charCount = content.length;
  const maxChars = 280;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please sign in to post');
      return;
    }

    if (!content.trim()) {
      toast.error('Post cannot be empty');
      return;
    }

    if (content.length > maxChars) {
      toast.error(`Post must be ${maxChars} characters or less`);
      return;
    }

    if (!topic) {
      toast.error('Please select a topic');
      return;
    }

    try {
      await createPost.mutateAsync({ content, topic });
      setContent('');
      setTopic('random');
      toast.success('Post published successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to publish post');
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Sign in to share your thoughts with the world
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="space-y-2">
              <Label htmlFor="topic" className="text-sm font-medium">
                Topic
              </Label>
              <Select value={topic} onValueChange={setTopic}>
                <SelectTrigger 
                  id="topic"
                  className="bg-background/50 border-border/50 focus:border-primary/50"
                >
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">Random</SelectItem>
                  <SelectItem value="politics">Politics</SelectItem>
                  <SelectItem value="tech">Tech</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none bg-background/50 border-border/50 focus:border-primary/50"
              maxLength={maxChars}
            />
            <div className="flex items-center justify-between">
              <span className={`text-sm ${charCount > maxChars ? 'text-destructive' : 'text-muted-foreground'}`}>
                {charCount} / {maxChars}
              </span>
              <Button 
                type="submit" 
                disabled={createPost.isPending || !content.trim() || charCount > maxChars || !topic}
                className="gap-2"
              >
                {createPost.isPending ? (
                  <>Publishing...</>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Publish
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

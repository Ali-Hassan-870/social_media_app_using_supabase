import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase-client";

interface Props {
  postId: number;
}

interface Like {
  id: number;
  post_id: number;
  user_id: string;
  like: number;
}

const like = async (likeValue: number, postId: number, userId: string) => {
  const { data: existingLike } = await supabase
    .from("likes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingLike) {
    if (existingLike.like === likeValue) {
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("id", existingLike.id);

      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("likes")
        .update({ like: likeValue })
        .eq("id", existingLike.id);

      if (error) throw new Error(error.message);
    }
  } else {
    const { error } = await supabase
      .from("likes")
      .insert({ post_id: postId, user_id: userId, like: likeValue });
    if (error) throw new Error(error.message);
  }
};

const fetchLikes = async (postId: number): Promise<Like[]> => {
  const { data, error } = await supabase
    .from("likes")
    .select("*")
    .eq("post_id", postId);

  if (error) throw new Error(error.message);
  return data as Like[];
};

export const LikeButton = ({ postId }: Props) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: likes,
    isLoading,
    error,
  } = useQuery<Like[], Error>({
    queryKey: ["likes", postId],
    queryFn: () => fetchLikes(postId),
    // refetchInterval: 600000,
  });

  const { mutate } = useMutation({
    mutationFn: (likeValue: number) => {
      if (!user) throw new Error("You must be logged in to like the post...");
      return like(likeValue, postId, user.id);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", postId] });
    },
  });

  if (isLoading) return <div>Loding likes count ...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const likesCount = likes?.filter((like) => like.like === 1).length || 0;
  const dislikesCount = likes?.filter((like) => like.like === -1).length || 0;
  const userLike = likes?.find((like) => like.user_id === user?.id)?.like;

  return (
    <div className="flex items-center space-x-4 my-4">
      <button
        onClick={() => mutate(1)}
        className={`px-3 py-1 cursor-pointer rounded transition-colors duration-150 ${
          userLike === 1 ? "bg-green-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        👍 {likesCount}
      </button>
      <button
        onClick={() => mutate(-1)}
        className={`px-3 py-1 cursor-pointer rounded transition-colors duration-150 ${
          userLike === -1 ? "bg-red-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        👎 {dislikesCount}
      </button>
    </div>
  );
};

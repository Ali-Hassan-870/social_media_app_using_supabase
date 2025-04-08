import { CreatePost } from "../components/CreatePost";

export const CreatePostPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Create New Post
        </h2>
        <p className="text-gray-400 text-center max-w-2xl mx-auto mb-8">
          Share your thoughts, ideas, and images with the community. Create a post that will engage others and spark meaningful conversations.
        </p>
        <CreatePost />
      </div>
    </div>
  );
};
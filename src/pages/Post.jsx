import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

function Post() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from("blogs")
          .select(
            `
            *,
            profiles:author_id (
              name,
              avatar_url
            )
          `
          )
          .eq("id", id)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!post) {
    return <div className="text-center py-12">Post not found</div>;
  }

  return (
    <article className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        {user?.id === post.author_id && (
          <Link
            to={`/edit/${post.id}`}
            className="inline-block px-4 py-2 bg-black text-white rounded mb-4"
          >
            Edit Post
          </Link>
        )}
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center text-gray-600 mb-8">
          <img
            src={post.profiles.avatar_url || "https://via.placeholder.com/40"}
            alt={post.profiles.name}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="font-medium">{post.profiles.name}</p>
            <p className="text-sm">
              {new Date(post.created_at).toLocaleDateString()}
              {post.updated_at !== post.created_at && " (edited)"}
            </p>
          </div>
        </div>
      </div>

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}

export default Post;

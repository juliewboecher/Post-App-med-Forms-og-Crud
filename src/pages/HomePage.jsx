import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

const URL = import.meta.env.VITE_SUPABASE_URL;

const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_APIKEY}`,
  "Content-Type": "application/json",
};

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadPosts() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await fetch(URL, {
          method: "GET",
          headers,
        });

        if (!response.ok) {
          throw new Error("Kunne ikke hente posts");
        }

        const data = await response.json();
        setPosts(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, []);

  return (
    <main className="app">
      <section className="feed-intro">
        <p className="feed-eyebrow">Post App</p>
        <h1 className="page-title">Explore the latest posts</h1>
      </section>

      {errorMessage && (
        <p className="status-banner status-banner-error">{errorMessage}</p>
      )}

      {isLoading && <p className="status-msg">Loading posts...</p>}

      {!isLoading && !errorMessage && posts.length === 0 && (
        <section className="empty-state">
          <h2>No posts yet</h2>
          <p>Hent posts fra Supabase med GET og vis dem her.</p>
        </section>
      )}

      {!isLoading && !errorMessage && posts.length > 0 && (
        <section className="post-list">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>
      )}
    </main>
  );
}

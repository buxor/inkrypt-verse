import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Post {
  id: string;
  title: string;
  date: string;
}

const AccountPage = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAddress = localStorage.getItem('walletAddress');
    if (storedAddress) {
      setAddress(storedAddress);
      // In a real app, you would fetch the user's posts from a backend here
      // For now, we'll use mock data
      setPosts([
        { id: '1', title: 'My First Inkrypt Post', date: '2024-03-15' },
        { id: '2', title: 'Thoughts on Bitcoin', date: '2024-03-16' },
      ]);
    } else {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">My Account</h1>
        {address && (
          <p className="text-lg mb-8">
            Connected Address: {address}
          </p>
        )}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">My Published Posts</h2>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Published on {post.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>You haven't published any posts yet.</p>
          )}
        </section>
        <Button onClick={() => navigate('/editor')} className="bg-primary text-primary-foreground hover:bg-primary/90">
          Create New Post
        </Button>
      </main>
      <Footer />
    </div>
  );
};

export default AccountPage;
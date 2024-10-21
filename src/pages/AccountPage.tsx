import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, PlusCircle } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  date: string;
  content?: string;
}

const AccountPage = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [publishedPosts, setPublishedPosts] = useState<Post[]>([]);
  const [drafts, setDrafts] = useState<Post[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAddress = localStorage.getItem('walletAddress');
    if (storedAddress) {
      setAddress(storedAddress);
      // Fetch published posts (mock data for now)
      setPublishedPosts([
        { id: '1', title: 'My First Inkrypt Post', date: '2024-03-15' },
        { id: '2', title: 'Thoughts on Bitcoin', date: '2024-03-16' },
      ]);
      // Fetch drafts from localStorage
      const draftTitle = localStorage.getItem('draftTitle');
      const draftContent = localStorage.getItem('draftContent');
      if (draftTitle && draftContent) {
        setDrafts([{ id: 'draft', title: draftTitle, date: new Date().toISOString().split('T')[0], content: draftContent }]);
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleEditDraft = () => {
    navigate('/editor');
  };

  const handleDeleteDraft = () => {
    localStorage.removeItem('draftTitle');
    localStorage.removeItem('draftContent');
    setDrafts([]);
  };

  const handleNewInkrypt = () => {
    localStorage.removeItem('draftTitle');
    localStorage.removeItem('draftContent');
    navigate('/editor');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Account</h1>
        {address && (
          <p className="text-lg mb-8">
            Connected Address: {address}
          </p>
        )}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Drafts</h2>
            <Button onClick={handleNewInkrypt} variant="outline" size="sm">
              <PlusCircle className="mr-2 h-4 w-4" /> New Inkrypt
            </Button>
          </div>
          {drafts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {drafts.map((draft) => (
                <Card key={draft.id}>
                  <CardHeader>
                    <CardTitle>{draft.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Last edited on {draft.date}</p>
                    <div className="flex space-x-2">
                      <Button onClick={handleEditDraft} variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <Button onClick={handleDeleteDraft} variant="outline" size="sm" className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>You don't have any drafts.</p>
          )}
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Published Posts</h2>
          {publishedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {publishedPosts.map((post) => (
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
      </main>
      <Footer />
    </div>
  );
};

export default AccountPage;
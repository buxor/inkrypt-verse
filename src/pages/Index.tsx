import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleList from '@/components/ArticleList';
import { BookOpen } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();

  const handleConnect = () => {
    toast({
      title: "Wallet Connection",
      description: "Wallet connection feature coming soon!",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h1 className="text-6xl font-extrabold mb-6">Welcome to Inkrypt</h1>
          <p className="text-xl mb-8 text-muted-foreground">Decentralized publishing on the Bitcoin blockchain</p>
          <Button onClick={handleConnect} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <BookOpen className="mr-2 h-4 w-4" /> Start Writing
          </Button>
        </section>
        <ArticleList />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
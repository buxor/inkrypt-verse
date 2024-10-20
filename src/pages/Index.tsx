import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleList from '@/components/ArticleList';

const Index = () => {
  const { toast } = useToast();

  const handleConnect = () => {
    toast({
      title: "Wallet Connection",
      description: "Wallet connection feature coming soon!",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Welcome to Inkrypt</h1>
          <p className="text-xl mb-6">Decentralized publishing on the Bitcoin blockchain</p>
          <Button onClick={handleConnect} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
            Connect Wallet
          </Button>
        </section>
        <ArticleList />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
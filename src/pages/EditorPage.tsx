import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Editor from '@/components/Editor';

const EditorPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <Editor />
      </main>
      <Footer />
    </div>
  );
};

export default EditorPage;
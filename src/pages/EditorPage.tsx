import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Editor from '@/components/Editor';

const EditorPage = () => {
  const location = useLocation();
  const draft = location.state?.draft;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <Editor initialTitle={draft?.title || ''} initialContent={draft?.content || ''} />
      </main>
      <Footer />
    </div>
  );
};

export default EditorPage;
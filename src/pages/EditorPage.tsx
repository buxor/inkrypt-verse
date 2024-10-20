import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Editor from '@/components/Editor';

const EditorPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Create New Article</h1>
        <Editor />
      </main>
      <Footer />
    </div>
  );
};

export default EditorPage;
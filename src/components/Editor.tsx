import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { CloudUpload } from 'lucide-react';

const Editor = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { toast } = useToast();

  const handleInkrypt = () => {
    toast({
      title: "Inkrypt",
      description: "Article inscription feature coming soon!",
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <Input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-4xl font-bold border-none outline-none mb-8 placeholder-gray-300 focus:ring-0 bg-transparent text-primary"
      />
      <div 
        className="prose prose-lg max-w-none focus:outline-none text-primary"
        contentEditable
        onInput={(e) => setContent(e.currentTarget.textContent || '')}
        dangerouslySetInnerHTML={{ __html: 'Tell your story...' }}
      />
      <div className="fixed bottom-8 right-8">
        <Button onClick={handleInkrypt} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 py-3 shadow-lg transition-all duration-200">
          <CloudUpload className="mr-2 h-5 w-5" /> Publish
        </Button>
      </div>
    </div>
  );
};

export default Editor;
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

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
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Article Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-xl font-bold"
      />
      <Textarea
        placeholder="Write your article here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[300px]"
      />
      <div className="flex justify-end">
        <Button onClick={handleInkrypt} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
          Inkrypt
        </Button>
      </div>
    </div>
  );
};

export default Editor;
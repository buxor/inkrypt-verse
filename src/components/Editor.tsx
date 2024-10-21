import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
    <div className="space-y-6">
      <Input
        type="text"
        placeholder="Article Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-2xl font-bold"
      />
      <Textarea
        placeholder="Write your article here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[400px] text-lg"
      />
      <div className="flex justify-end">
        <Button onClick={handleInkrypt} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <CloudUpload className="mr-2 h-4 w-4" /> Inkrypt
        </Button>
      </div>
    </div>
  );
};

export default Editor;
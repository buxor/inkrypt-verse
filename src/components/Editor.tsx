import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { CloudUpload } from 'lucide-react';
import { MenuBar } from './EditorComponents/MenuBar';
import { SlashCommands } from './EditorComponents/SlashCommands';
import { useNavigate } from 'react-router-dom';

const Editor = () => {
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none text-primary min-h-[300px]',
      },
    },
    onFocus: ({ editor }) => {
      if (editor.isEmpty) {
        editor.commands.setContent('<p></p>');
      }
    },
  });

  useEffect(() => {
    // Load draft from localStorage when component mounts
    const savedTitle = localStorage.getItem('draftTitle');
    const savedContent = localStorage.getItem('draftContent');
    if (savedTitle) setTitle(savedTitle);
    if (savedContent && editor) editor.commands.setContent(savedContent);
  }, [editor]);

  useEffect(() => {
    // Save draft to localStorage whenever title or content changes
    const saveTimeout = setTimeout(() => {
      if (title) localStorage.setItem('draftTitle', title);
      if (editor) localStorage.setItem('draftContent', editor.getHTML());
      setIsSaving(true);
      setTimeout(() => setIsSaving(false), 1000); // Hide "Saving..." after 1 second
    }, 2000); // Save after 2 seconds of inactivity

    return () => clearTimeout(saveTimeout);
  }, [title, editor]);

  const handleInkrypt = () => {
    const walletAddress = localStorage.getItem('walletAddress');
    if (!walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet before inscribing.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, you would send the post to a backend here
    // For now, we'll just store it in localStorage
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const newPost = {
      id: Date.now().toString(),
      title,
      content: editor?.getHTML(),
      date: new Date().toISOString().split('T')[0],
    };
    posts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));

    // Clear the draft after publishing
    localStorage.removeItem('draftTitle');
    localStorage.removeItem('draftContent');

    toast({
      title: "Post Published",
      description: "Your article has been successfully published!",
    });
    navigate('/account');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-4xl font-bold border-none outline-none mb-8 placeholder-gray-300 focus:ring-0 bg-transparent text-primary px-0"
        style={{ border: 'none', boxShadow: 'none' }}
      />
      <MenuBar editor={editor} />
      <div className="relative mt-4">
        <EditorContent 
          editor={editor} 
          className="focus:outline-none"
        />
        {editor && editor.isEmpty && (
          <div 
            className="absolute top-0 left-0 text-gray-400 pointer-events-none p-0"
            onClick={() => editor.commands.focus()}
          >
            Start writing...
          </div>
        )}
      </div>
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'is-active' : ''}
          >
            Bold
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'is-active' : ''}
          >
            Italic
          </Button>
        </BubbleMenu>
      )}
      <div className="fixed bottom-8 right-8 flex items-center space-x-4">
        {isSaving && (
          <span className="text-sm text-gray-500">Saving...</span>
        )}
        <Button onClick={handleInkrypt} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 py-3 shadow-lg transition-all duration-200">
          <CloudUpload className="mr-2 h-5 w-5" /> Inkrypt
        </Button>
      </div>
    </div>
  );
};

export default Editor;

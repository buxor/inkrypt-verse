import React, { useState } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { CloudUpload, Image as ImageIcon, Heading1, Heading2, Bold, Italic, List, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex space-x-2 mb-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};

const SlashCommands = ({ editor }) => {
  const items = [
    {
      title: 'Image',
      icon: <ImageIcon className="h-4 w-4" />,
      command: ({ editor, range }) => {
        const url = window.prompt('Enter the URL of the image:');
        if (url) {
          editor.chain().focus().deleteRange(range).setImage({ src: url }).run();
        }
      },
    },
    {
      title: 'Heading 1',
      icon: <Heading1 className="h-4 w-4" />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
      },
    },
    {
      title: 'Heading 2',
      icon: <Heading2 className="h-4 w-4" />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
      },
    },
    // Add more slash commands as needed
  ];

  return (
    <div className="absolute z-50 bg-white shadow-lg rounded-md p-2">
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => item.command({ editor })}
          className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-100 w-full text-left"
        >
          {item.icon}
          <span>{item.title}</span>
        </button>
      ))}
    </div>
  );
};

const Editor = () => {
  const [title, setTitle] = useState('');
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

  const handleInkrypt = () => {
    // Check if wallet is connected
    const walletAddress = localStorage.getItem('walletAddress');
    if (!walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet before inscribing.",
        variant: "destructive",
      });
      return;
    }

    // Proceed with inscription logic
    toast({
      title: "Inkrypt",
      description: "Article inscription feature coming soon!",
    });
  };

  const handleBack = () => {
    navigate('/');
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
      <div className="fixed bottom-8 left-8">
        <Button onClick={handleBack} variant="outline" className="rounded-full px-6 py-3 shadow-lg transition-all duration-200">
          <ArrowLeft className="mr-2 h-5 w-5" /> Back
        </Button>
      </div>
      <div className="fixed bottom-8 right-8">
        <Button onClick={handleInkrypt} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 py-3 shadow-lg transition-all duration-200">
          <CloudUpload className="mr-2 h-5 w-5" /> Inkrypt
        </Button>
      </div>
    </div>
  );
};

export default Editor;
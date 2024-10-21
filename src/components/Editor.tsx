import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { CloudUpload, Save } from 'lucide-react';
import { MenuBar } from './EditorComponents/MenuBar';
import { SlashCommands } from './EditorComponents/SlashCommands';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Editor = ({ initialTitle = '', initialContent = '', draftId = null }) => {
  const [title, setTitle] = useState(initialTitle);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
    ],
    content: initialContent,
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
    const saveTimeout = setTimeout(() => {
      if (title) localStorage.setItem('draftTitle', title);
      if (editor) localStorage.setItem('draftContent', editor.getHTML());
      setIsSaving(true);
      setTimeout(() => setIsSaving(false), 1000);
    }, 2000);

    return () => clearTimeout(saveTimeout);
  }, [title, editor]);

  const handleInkrypt = async () => {
    const walletAddress = localStorage.getItem('walletAddress');
    if (!walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet before inscribing.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Prepare the content for inscription
      const content = JSON.stringify({
        title,
        body: editor?.getHTML(),
        date: new Date().toISOString(),
        address: walletAddress,
      });

      // Call the UniSat API to create an inscription
      const response = await axios.post('https://open-api.unisat.io/v1/inscribe/create', {
        content,
        contentType: 'text/plain',
        receiveAddress: walletAddress,
      }, {
        headers: {
          'Authorization': 'Bearer 1e99b7f91b8f082ece273c187a1784519f90c3ad554cc4c4b9c4bbd1b30d7485'
        }
      });

      if (response.data && response.data.orderId) {
        // Store the orderId for later use
        localStorage.setItem('lastInscriptionOrderId', response.data.orderId);

        toast({
          title: "Inscription Created",
          description: "Your content has been prepared for inscription. Please complete the payment to finalize.",
        });

        // Here you would typically redirect to a payment page or show payment instructions
        // For now, we'll just log the order details
        console.log('Inscription order created:', response.data);
      } else {
        throw new Error('Failed to create inscription order');
      }
    } catch (error) {
      console.error('Error creating inscription:', error);
      toast({
        title: "Inscription Failed",
        description: "There was an error creating the inscription. Please try again.",
        variant: "destructive",
      });
    }

    // Keep the existing local storage logic
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const newPost = {
      id: Date.now().toString(),
      title,
      content: editor?.getHTML(),
      date: new Date().toISOString().split('T')[0],
      address: walletAddress,
    };
    posts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));

    // Clear the draft after publishing
    localStorage.removeItem('draftTitle');
    localStorage.removeItem('draftContent');

    navigate('/account');
  };

  const handleSaveDraft = () => {
    const walletAddress = localStorage.getItem('walletAddress');
    if (!walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet before saving a draft.",
        variant: "destructive",
      });
      return;
    }

    const drafts = JSON.parse(localStorage.getItem('drafts') || '[]');
    const newDraft = {
      id: draftId || Date.now().toString(),
      title,
      content: editor?.getHTML(),
      date: new Date().toISOString(),
      address: walletAddress,
    };

    if (draftId) {
      // Update existing draft
      const draftIndex = drafts.findIndex(draft => draft.id === draftId && draft.address === walletAddress);
      if (draftIndex !== -1) {
        drafts[draftIndex] = newDraft;
      } else {
        drafts.push(newDraft);
      }
    } else {
      // Create new draft
      drafts.push(newDraft);
    }

    localStorage.setItem('drafts', JSON.stringify(drafts));
    toast({
      title: draftId ? "Draft Updated" : "Draft Saved",
      description: draftId ? "Your draft has been updated successfully." : "Your draft has been saved successfully.",
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
        <Button onClick={handleSaveDraft} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-6 py-3 shadow-lg transition-all duration-200">
          <Save className="mr-2 h-5 w-5" /> Save Draft
        </Button>
        <Button onClick={handleInkrypt} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 py-3 shadow-lg transition-all duration-200">
          <CloudUpload className="mr-2 h-5 w-5" /> Inkrypt
        </Button>
      </div>
    </div>
  );
};

export default Editor;

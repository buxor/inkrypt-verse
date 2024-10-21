import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Editor from '@/components/Editor';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, CloudUpload } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const EditorPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDiscard = () => {
    // Implement discard logic here (e.g., show a confirmation dialog)
    navigate('/account');
  };

  const handleSaveDraft = () => {
    // Implement save draft logic here
    // For now, we'll just show a toast and navigate back
    toast({
      title: "Draft Saved",
      description: "Your draft has been saved successfully.",
    });
    navigate('/account');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <Editor />
        <div className="fixed bottom-8 left-8">
          <Button onClick={handleDiscard} variant="outline" className="rounded-full px-6 py-3 shadow-lg transition-all duration-200">
            <ArrowLeft className="mr-2 h-5 w-5" /> Discard
          </Button>
        </div>
        <div className="fixed bottom-8 right-8 flex items-center space-x-4">
          <Button onClick={handleSaveDraft} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-6 py-3 shadow-lg transition-all duration-200">
            <Save className="mr-2 h-5 w-5" /> Save Draft
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 py-3 shadow-lg transition-all duration-200">
            <CloudUpload className="mr-2 h-5 w-5" /> Inkrypt
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditorPage;
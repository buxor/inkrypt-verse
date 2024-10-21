import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Editor from '@/components/Editor';
import { Button } from "@/components/ui/button";
import { Save, CloudUpload } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const EditorPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDiscard = () => {
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="rounded-full px-6 py-3 shadow-lg transition-all duration-200">
                Discard
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently discard your draft.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDiscard}>Discard</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
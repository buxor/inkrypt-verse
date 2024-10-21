import React from 'react';
import { ImageIcon, Heading1, Heading2 } from 'lucide-react';

export const SlashCommands = ({ editor }) => {
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
  ];

  return (
    <div className="absolute z-50 bg-white shadow-lg rounded-md p-2">
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => item.command({ editor, range: editor.state.selection })}
          className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-100 w-full text-left"
        >
          {item.icon}
          <span>{item.title}</span>
        </button>
      ))}
    </div>
  );
};
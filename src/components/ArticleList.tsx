import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ArticleList = () => {
  const articles = [
    { id: 1, title: "The Future of Decentralized Publishing", author: "Satoshi Nakamoto", date: "2024-03-01" },
    { id: 2, title: "Why Bitcoin Ordinals Matter", author: "Vitalik Buterin", date: "2024-02-28" },
    { id: 3, title: "Inkrypt: Revolutionizing Content Creation", author: "Ada Lovelace", date: "2024-02-27" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <Card key={article.id} className="bg-gray-700 text-white">
          <CardHeader>
            <CardTitle>{article.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-300">By {article.author}</p>
            <p className="text-sm text-gray-400">{article.date}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ArticleList;
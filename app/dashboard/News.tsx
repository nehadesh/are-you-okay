"use client";

import { useEffect, useState } from "react";

interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
}

interface NewsProps {
  location: string;
}

const News: React.FC<NewsProps> = ({ location }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      const apiKey = "74e7a01557244d0090313d6534c70888";

      if (!apiKey) {
        setError("Missing News API key");
        return;
      }

      const weatherTerms = [
        "storm",
        "flood",
        "tornado",
        "hurricane",
        "earthquake",
        "wildfire",
        "blizzard",
        "drought",
        "heatwave",
        "weather alert",
        "natural disaster",
    ];
    
    const weatherQuery = weatherTerms.join(" OR ");
    const fullQuery = `${location} AND (${weatherQuery})`;

      const today = new Date();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 7);

      const formatDate = (date: Date) => date.toISOString().split("T")[0];
      
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        fullQuery)}&from=${formatDate(oneWeekAgo)}&to=${formatDate(today)}&sortBy=publishedAt&apiKey=${apiKey}`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.status === "ok") {
          setArticles(data.articles);
        } else {
          setError(data.message || "Failed to fetch news");
        }
      } catch (err) {
        setError("Network error");
      }
    };

    fetchNews();
  }, [location]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (articles.length === 0) {
    return <p className="text-gray-600">No news found for today.</p>;
  }

  return (
    <div className="space-y-6 mt-6">
      {articles.map((article, idx) => (
        <div key={idx} className="rounded-lg border p-4 shadow-sm hover:shadow-md transition">
          {article.urlToImage && (
            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-full h-48 object-cover rounded-md mb-3"
            />
          )}
          <h3 className="text-lg font-bold">
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {article.title}
            </a>
          </h3>
          <p className="text-sm text-gray-500 mb-1">
            {new Date(article.publishedAt).toLocaleString()} &mdash; {article.source.name}
          </p>
          <p className="text-gray-700 text-sm">{article.description}</p>
        </div>
      ))}
    </div>
  );
};

export default News;

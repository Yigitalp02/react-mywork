// src/components/LatestNews.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './latestNews.css';

const LatestNews: React.FC = () => {
  const [news, setNews] = useState<any[]>([]); 
  const [error, setError] = useState<string | null>(null); 
  const fallbackImage = 'https://via.placeholder.com/150'; 

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('https://api.nytimes.com/svc/topstories/v2/home.json', {
          params: {
            'api-key': import.meta.env.VITE_NYT_API_KEY, // Use the Vite environment variable
          },    
        });
        setNews(response.data.results);
      } catch (err) {
        setError('Failed to fetch news');
        console.error("Error fetching news:", err);
      }
    };

    fetchNews();
  }, []);

  const ensureHttps = (url: string) => {
    if (!url) return fallbackImage;
    return url.startsWith('http:') && window.location.protocol === 'https:'
      ? url.replace('http:', 'https:')
      : url;
  };

  const handleNewsClick = (url: string) => {
    window.open(url, '_blank');
  };

  if (error) {
    return <div id="latest-news" className="latest-news">{error}</div>;
  }

  return (
    <div id="latest-news" className="latest-news">
      <h2>Hot Topics</h2>
      {news.length > 0 && (
        <div
          className="hot-topic"
          onClick={() => handleNewsClick(news[0].url)}
        >
          <img
            src={ensureHttps(news[0].multimedia && news[0].multimedia[0] ? news[0].multimedia[0].url : '') || fallbackImage}
            alt="Hot Topic"
            className="hot-topic-image"
          />
          <div className="hot-topic-details">
            <h3>{news[0].title}</h3>
            <p>{news[0].published_date} - {news[0].source}</p>
          </div>
        </div>
      )}
      <h2>Latest News</h2>
      <div className="latest-news-list">
        {news.slice(1, 4).map((article, index) => {
          const imageUrl = ensureHttps(article.multimedia && article.multimedia[0] ? article.multimedia[0].url : '');
          return (
            <div
              key={index}
              className="latest-news-item"
              onClick={() => handleNewsClick(article.url)}
            >
              <img
                src={imageUrl}
                alt="Latest News"
                className="latest-news-image"
              />
              <p>{article.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LatestNews;

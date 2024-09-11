import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './searchBar.css';
import searchIcon from '../icons/search.png'; // Adjust the path as necessary

const subPages = [
  { name: 'Home News', path: '/home/news' },
  { name: 'Home Tasks', path: '/home/tasks' },
  { name: 'Home Done Tasks', path: '/home/done-tasks' },
  { name: 'Home Person List', path: '/home/person-list' },
  { name: 'Profile Info', path: '/profile/info' },
  { name: 'Profile Reminders', path: '/profile/reminders' },
  { name: 'Contact', path: '/contact' },
  { name: 'About Us', path: '/about' },
  { name: 'Message Board', path: '/home/message-board' },
];

const secretCode = 'TooSecret';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [filteredPages, setFilteredPages] = useState(subPages);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setQuery(input);

    if (input) {
      if (input.toLowerCase() === secretCode.toLowerCase()) {
        setFilteredPages([]); // Don't show any result when the secret code is typed
      } else {
        const filtered = subPages
          .filter((page) =>
            page.name.toLowerCase().includes(input.toLowerCase())
          )
          .sort((a, b) => {
            if (a.name.toLowerCase().startsWith(input.toLowerCase())) return -1;
            if (b.name.toLowerCase().startsWith(input.toLowerCase())) return 1;
            return 0;
          });
        setFilteredPages(filtered);
      }
    } else {
      setFilteredPages(subPages);
    }
  };

  const handlePageClick = (path: string) => {
    navigate(path);
    setQuery('');
    setFilteredPages(subPages);
  };

  const handleSearchSubmit = () => {
    if (query.toLowerCase() === secretCode.toLowerCase()) {
      navigate('/snake-game'); // Navigate to the Snake Game page
      setQuery(''); // Clear the input
    }
  };

  return (
    <div className="search-bar-container">
      <img src={searchIcon} alt="Search" className="search-icon" />
      <input
        type="text"
        placeholder="Search"
        value={query}
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearchSubmit();
          }
        }}
        className="search-input"
      />
      {query && (
        <ul className="search-results">
          {filteredPages.map((page) => (
            <li
              key={page.path}
              onClick={() => handlePageClick(page.path)}
              className="search-result-item"
            >
              {page.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;

import React, { useState } from 'react';

interface MessageInputProps {
  onSubmit: (content: string) => void; // Update this to accept a string parameter
}

const MessageInput: React.FC<MessageInputProps> = ({ onSubmit }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content); // Pass the content to the parent component
      setContent(''); // Clear the input after submission
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your message here"
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageInput;

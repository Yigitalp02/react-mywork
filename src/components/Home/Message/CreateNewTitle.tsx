import React, { useState } from 'react';
import './CreateNewTitle.css';

interface CreateNewTitleProps {
  onAdd: (title: string, content: string) => void;
}

const CreateNewTitle: React.FC<CreateNewTitleProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleAdd = () => {
    if (title && content) {
      console.log('Add button clicked', { title, content }); // Log to verify button click
      onAdd(title, content);  // Call the add function passed as a prop
    } else {
      console.log('Title or content missing');
    }
  };

  const handleClear = () => {
    setTitle('');
    setContent('');
  };

  return (
    <div className="create-new-title">
      <h2>Create New Title</h2>
      <div className="form-group">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-control"
          placeholder="Title"
        />
      </div>
      <div className="form-group">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="form-control"
          placeholder="Content"
        />
      </div>
      <div className="button-group">
        <button onClick={handleAdd} className="btn btn-primary">Add</button>
        <button onClick={handleClear} className="btn btn-secondary">Clear</button>
      </div>
    </div>
  );
};

export default CreateNewTitle;

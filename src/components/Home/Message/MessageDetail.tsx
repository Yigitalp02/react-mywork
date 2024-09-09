import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, onValue, push, set } from 'firebase/database';
import MessageInput from './MessageInput';
import { UserContext } from '../../UserContext';
import './messageDetail.css';

const MessageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const userContext = useContext(UserContext); // Get the user context
  const user = userContext?.user; // Safely access the user

  useEffect(() => {
    const db = getDatabase();
    const messageRef = ref(db, `Messages/${id}`);
    onValue(messageRef, (snapshot) => {
      const data = snapshot.val() || {};
      setTitle(data.title || '');
      const messageList = Object.keys(data.messages || {}).map(key => ({
        id: key,
        ...data.messages[key],
      }));
      setMessages(messageList);
    });
  }, [id]);

  const addMessage = (content: string) => {
    if (!user) return; // Ensure user is available

    const db = getDatabase();
    const messageRef = ref(db, `Messages/${id}/messages`);
    const newMessageRef = push(messageRef);
    set(newMessageRef, {
      sender: user.name, // Use the actual user's name
      content,
      date: new Date().toISOString(),
    });
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleString('en-GB', options);
  };

  return (
    <div id="message-detail-page">
      <div className="message-detail">
        <h2>{title}</h2>
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className="message">
              <p><strong>{message.sender}</strong> - {formatDate(message.date)}</p>
              <p>{message.content}</p>
            </div>
          ))}
        </div>
        <MessageInput onSubmit={addMessage} />
      </div>
    </div>
  );
};

export default MessageDetail;
import React from 'react';
import { Link } from 'react-router-dom';
import './MessageList.css';

interface Message {
  id: string;
  title: string;
  lastMessage: string;
  lastSender: string;
  lastDate: string;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="message-list">
      <h2>Message Board</h2>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Message Title</th>
            <th>Last Message</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((message) => (
            <tr key={message.id}>
              <td>
                <Link to={`/home/message-board/${message.id}`}>{message.title}</Link>
              </td>
              <td>
                <span>{message.lastSender || 'Unknown'}</span> - <span>{new Date(message.lastDate).toLocaleString()}</span>
                <p>{message.lastMessage || 'No message yet'}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MessageList;

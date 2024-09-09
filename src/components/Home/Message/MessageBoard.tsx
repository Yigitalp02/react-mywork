import React, { useState, useEffect, useContext } from 'react';
import { getDatabase, ref, onValue, push, set} from 'firebase/database';
import MessageList from './MessageList';
import CreateNewTitle from './CreateNewTitle';
import { UserContext } from '../../UserContext';
import './messageBoard.css';

interface Message {
  content: string;
  sender: string;
  date: string;
}

interface MessageData {
  id: string;
  title: string;
  messages: Record<string, Message>;
}

interface SimplifiedMessage {
  id: string;
  title: string;
  lastMessage: string;
  lastSender: string;
  lastDate: string;
}

const MessageBoard: React.FC = () => {
  const [messages, setMessages] = useState<SimplifiedMessage[]>([]);
  const context = useContext(UserContext);
  const user = context?.user;

  useEffect(() => {
    const db = getDatabase();
    const messagesRef = ref(db, 'Messages');

    onValue(messagesRef, (snapshot) => {
      const data: Record<string, MessageData> = snapshot.val() || {};
      const messageList = Object.keys(data).map(key => {
        const messagesArray = Object.values(data[key].messages || {});
        const lastMessage = messagesArray[messagesArray.length - 1] || {};

        return {
          id: key,
          title: data[key].title,
          lastMessage: lastMessage.content || 'No message yet',
          lastSender: lastMessage.sender || 'Unknown',
          lastDate: lastMessage.date || '',
        };
      });

      setMessages(messageList);
    });
  }, []);

  const addNewTitle = (title: string, content: string) => {
    if (!user) {
      console.log('User not authenticated');  // Log if no user is available
      return;
    }
    
    const db = getDatabase();
    const userRef = ref(db, `users/${user.uid}`);
  
    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      const senderName = userData?.name || 'Anonymous';
  
      const messagesRef = ref(db, 'Messages');
      const newMessageRef = push(messagesRef);
  
      console.log('Adding new message:', { title, content, senderName });  // Log this to verify data
  
      set(newMessageRef, {
        title,
        messages: {
          1: {
            sender: senderName,
            content,
            date: new Date().toISOString(),
          },
        },
      }).then(() => {
        console.log('New message added successfully');
      }).catch((error) => {
        console.error('Error adding new title:', error);
      });
    }, { onlyOnce: true });
  };

  return (
    <div id="message-board" className="message-board">
      <MessageList messages={messages} /> {/* Pass the simplified message array */}
      <CreateNewTitle onAdd={addNewTitle} />
    </div>
  );
};

export default MessageBoard;

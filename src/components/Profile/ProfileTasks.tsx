// src/components/Profile/ProfileTasks.tsx
import React, { useState, useEffect, useContext } from 'react';
import { getDatabase, ref, onValue, set, remove } from 'firebase/database';
import { UserContext } from '../UserContext';
import './profileTasks.css';

interface Task {
  key: string;
  displayKey: number;
  summary: string;
  status: string;
  comment: string;
}

const ProfileTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]); // Görevleri saklamak için durum
  const [error, setError] = useState<string | null>(null); // Hata mesajını saklamak için durum
  const userContext = useContext(UserContext); // Kullanıcı bağlamını almak için kullanılır

  if (!userContext) {
    return null; // veya bir yükleniyor göstergesi
  }

  const { user } = userContext;

  useEffect(() => {
    if (user) {
      const db = getDatabase();
      const tasksRef = ref(db, 'users/' + user.uid + '/tasks');
      onValue(tasksRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const formattedTasks = Object.keys(data).map(key => ({
            key,
            displayKey: data[key].displayKey || tasks.length + 1,
            ...data[key],
          }));
          formattedTasks.sort((a, b) => a.displayKey - b.displayKey);
          setTasks(formattedTasks);
        }
      });
    }
  }, [user]);

  // Görevin durumunu değiştiren fonksiyon
  const handleStatusClick = (index: number) => {
    const newTasks = [...tasks];
    const currentStatus = newTasks[index].status;
    let newStatus = 'TO DO';
    if (currentStatus === 'TO DO') {
      newStatus = 'IN PROGRESS';
    } else if (currentStatus === 'IN PROGRESS') {
      newStatus = 'DONE';
    }
    newTasks[index].status = newStatus;
    setTasks(newTasks);

    if (user) {
      const db = getDatabase();
      set(ref(db, 'users/' + user.uid + '/tasks/' + newTasks[index].key), newTasks[index]);
    }
  };

  // Görev bilgilerini değiştiren fonksiyon
  const handleInputChange = (index: number, field: keyof Task, value: string) => {
    const newTasks = [...tasks];
    if (field === 'displayKey') {
      newTasks[index].displayKey = parseInt(value);
    } else {
      newTasks[index][field] = value;
    }
    newTasks.sort((a, b) => a.displayKey - b.displayKey);
    setTasks(newTasks);

    if (user) {
      const db = getDatabase();
      set(ref(db, 'users/' + user.uid + '/tasks/' + newTasks[index].key), newTasks[index]);
    }
  };

  // Yeni görev ekleyen fonksiyon
  const addTask = () => {
    if (user) {
      const db = getDatabase();
      const newKey = Date.now().toString();
      const newDisplayKey = tasks.length > 0 ? Math.max(...tasks.map(task => task.displayKey)) + 1 : 1;
      const newTask: Task = {
        key: newKey,
        displayKey: newDisplayKey,
        summary: '',
        status: 'TO DO',
        comment: ''
      };
      set(ref(db, 'users/' + user.uid + '/tasks/' + newTask.key), newTask);
      setTasks(prevTasks => [...prevTasks, newTask].sort((a, b) => a.displayKey - b.displayKey));
    }
  };

  // Görevi silen fonksiyon
  const handleDelete = (key: string) => {
    if (user) {
      const db = getDatabase();
      const taskRef = ref(db, 'users/' + user.uid + '/tasks/' + key);
      remove(taskRef);
      setTasks(prevTasks => prevTasks.filter(task => task.key !== key));
    }
  };

  // Görev anahtarının geçerliliğini kontrol eden fonksiyon
  const validateKey = (index: number) => {
    const newTasks = [...tasks];
    if (newTasks[index].displayKey.toString().trim() === '') {
      setError('Key cannot be empty.');
      return false;
    }
    setError(null);
    return true;
  };

  // Görev anahtarı geçersizse yeni anahtar atayan fonksiyon
  const handleBlur = (index: number) => {
    if (!validateKey(index)) {
      const newTasks = [...tasks];
      newTasks[index].displayKey = (tasks.length > 0 ? Math.max(...tasks.map(task => task.displayKey)) + 1 : 1);
      setTasks(newTasks);

      if (user) {
        const db = getDatabase();
        set(ref(db, 'users/' + user.uid + '/tasks/' + newTasks[index].key), newTasks[index]);
      }
    }
  };

  return (
    <div id="profile-tasks" className="profile-tasks">
      <button onClick={addTask} className="add-task-button">Add Task</button>
      {error && <div className="error-message">{error}</div>}
      <table className="tasks-table">
        <thead>
          <tr>
            <th className="key-header">Key</th> 
            <th>Summary</th>
            <th>Status</th>
            <th className="comment-header">Comment</th>
            <th className="action-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={task.key}>
              <td className="key-cell">
                <div className="key-input-wrapper">
                  <span className="key-hash">#</span>
                  <input
                    type="number"
                    value={task.displayKey}
                    onChange={(e) => handleInputChange(index, 'displayKey', e.target.value)}
                    onBlur={() => handleBlur(index)}
                    className="key-input"
                    min="1"
                  />
                </div>
              </td>
              <td className="summary">
                <textarea
                  value={task.summary}
                  onChange={(e) => handleInputChange(index, 'summary', e.target.value)}
                />
              </td>
              <td className={`status ${task.status.toLowerCase().replace(' ', '-')}`} onClick={() => handleStatusClick(index)}>
                {task.status}
              </td>
              <td className="comment">
                <textarea
                  value={task.comment}
                  onChange={(e) => handleInputChange(index, 'comment', e.target.value)}
                />
              </td>
              <td className="actions">
                <button onClick={() => handleDelete(task.key)} className="delete-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProfileTasks;

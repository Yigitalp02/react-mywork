import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, set, remove } from 'firebase/database';
import emailjs from 'emailjs-com'; // Import emailjs
import './homeTasks.css';

interface Task {
  key: string;
  displayKey: number;
  summary: string;
  status: string;
  assignee: string;
}

interface User {
  uid: string;
  name: string;
  email: string;
}

const AdminTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]); // Users state

  useEffect(() => {
    const db = getDatabase();

    // Fetch tasks from Firebase
    const tasksRef = ref(db, 'tasks');
    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedTasks = Object.keys(data).map((key) => ({
          key,
          displayKey: data[key].displayKey || tasks.length + 1,
          ...data[key],
        }));
        loadedTasks.sort((a, b) => a.displayKey - b.displayKey);
        setTasks(loadedTasks);
      }
    });

    // Fetch users from Firebase
    const usersRef = ref(db, 'users');
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedUsers = Object.keys(data).map((uid) => ({
          uid,
          name: data[uid].name,
          email: data[uid].email,
        }));
        setUsers(loadedUsers);
      }
    });
  }, []);

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
    updateTasksInDatabase(newTasks);
  };

  const handleInputChange = (index: number, field: keyof Task, value: string) => {
    const newTasks = [...tasks];
    if (field === 'displayKey') {
      newTasks[index].displayKey = parseInt(value);
    } else {
      newTasks[index][field] = value;
    }
    newTasks.sort((a, b) => a.displayKey - b.displayKey);
    setTasks(newTasks);
    updateTasksInDatabase(newTasks);
  };

  const handleAssigneeChange = (index: number, value: string) => {
    const newTasks = [...tasks];
    newTasks[index].assignee = value;
    setTasks(newTasks);
    updateTasksInDatabase(newTasks);
  };

  const updateTasksInDatabase = (updatedTasks: Task[]) => {
    const db = getDatabase();
    const tasksRef = ref(db, 'tasks');
    const tasksObject = updatedTasks.reduce((acc, task) => {
      acc[task.key] = {
        displayKey: task.displayKey,
        summary: task.summary,
        status: task.status,
        assignee: task.assignee,
      };
      return acc;
    }, {} as Record<string, Omit<Task, 'key'>>);
    set(tasksRef, tasksObject);
  };

  const addTask = () => {
    const db = getDatabase();
    const newKey = Date.now().toString();
    const newDisplayKey = tasks.length > 0 ? Math.max(...tasks.map(task => task.displayKey)) + 1 : 1;
    const newTask: Task = {
      key: newKey,
      displayKey: newDisplayKey,
      summary: '',
      status: 'TO DO',
      assignee: ''
    };
    set(ref(db, 'tasks/' + newTask.key), newTask);
    setTasks(prevTasks => [...prevTasks, newTask].sort((a, b) => a.displayKey - b.displayKey));
  };

  const handleDelete = (key: string) => {
    const db = getDatabase();
    const taskRef = ref(db, 'tasks/' + key);
    remove(taskRef);
    setTasks(prevTasks => prevTasks.filter(task => task.key !== key));
  };

  const sendReminderEmail = (task: Task) => {
    const selectedUser = users.find(user => user.name === task.assignee);
    if (selectedUser) {
      const templateParams = {
        name: selectedUser.name,
        task_summary: task.summary,
        task_status: task.status,
        email: selectedUser.email,
      };

      // Send email using EmailJS
      emailjs.send('service_h2uk57t', 'template_0yelkcd', templateParams, '9h7w37IYT_ZFZeu8r')
        .then(() => {
          alert('Reminder email sent successfully!');
        })
        .catch((error) => {
          console.error('Error sending email:', error);
        });
    }
  };

  return (
    <div id="home-tasks" className="home-tasks">
      <button onClick={addTask} className="add-task-button">Add Task</button>
      <table className="tasks-table">
        <thead>
          <tr>
            <th className="key-header">Key</th>
            <th>Summary</th>
            <th>Status</th>
            <th className="assignee-admin-header">Assignee</th>
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
              <td className="assignee-admin">
                <select
                  value={task.assignee}
                  onChange={(e) => handleAssigneeChange(index, e.target.value)}
                >
                  <option value="">Select Assignee</option>
                  {users.map(user => (
                    <option key={user.uid} value={user.name}>
                      {user.name}
                    </option>
                  ))}
                </select>
                {task.assignee && (
                  <button onClick={() => sendReminderEmail(task)} className="send-email-button">
                    Send Email
                  </button>
                )}
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

export default AdminTasks;

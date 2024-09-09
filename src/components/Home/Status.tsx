import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import './status.css';

interface Task {
  title: string;
  summary: string;
  status: string;
}

const Status: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const db = getDatabase();
    const tasksRef = ref(db, 'tasks');

    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const filteredTasks = Object.keys(data)
          .map((key) => ({
            title: key,
            ...data[key],
          }))
          .filter(
            (task) =>
              task.status === 'TO DO' || task.status === 'IN PROGRESS'
          );
        setTasks(filteredTasks);
      }
    });
  }, []);

  return (
    <div id="status-section" className="status-section">
      <h2>Task Status</h2>
      <table>
        <thead>
          <tr>
            <th className="task-title">Task Title</th>
            <th className="task-desc">Task Description</th>
            <th className="task-status">Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index}>
              <td className="task-title">{index + 1}</td> {/* Chronological number */}
              <td className="task-desc">{task.summary}</td>
              <td className={`task-status ${task.status.toLowerCase().replace(' ', '-')}`}>
                {task.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Status;

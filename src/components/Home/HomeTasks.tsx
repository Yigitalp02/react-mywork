// src/components/HomeTasks.tsx
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import './homeTasks.css';

interface Task {
  key: string;
  displayKey: number;
  summary: string;
  status: string;
  assignee: string;
}

const HomeTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]); // tasks durum değişkenini tanımlar

  useEffect(() => {
    const db = getDatabase(); // Firebase veritabanını alır
    const tasksRef = ref(db, 'tasks'); // tasks referansını alır
    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val(); // Veritabanındaki verileri alır
      if (data) {
        const loadedTasks = Object.keys(data).map((key) => ({
          key,
          displayKey: data[key].displayKey || tasks.length + 1,
          ...data[key],
        }));
        loadedTasks.sort((a, b) => a.displayKey - b.displayKey); // Taskleri displayKey'e göre sıralar
        setTasks(loadedTasks); // tasks durumunu günceller
      }
    });
  }, []); // Bileşen yüklendiğinde çalışır

  return (
    <div id="home-tasks" className="home-tasks">
      <table className="tasks-table">
        <thead>
          <tr>
            <th className="key-header">Key</th>
            <th>Summary</th>
            <th>Status</th>
            <th className="assignee-header">Assignee</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.key}>
              <td className="key-cell">
                <div className="key-input-wrapper">
                  <span className="key-hash">#</span> {/* Key'in önüne # ekler */}
                  <span>{task.displayKey}</span> {/* displayKey'i gösterir */}
                </div>
              </td>
              <td className="summary">
                {task.summary} {/* Taskin özetini gösterir */}
              </td>
              <td className={`status ${task.status.toLowerCase().replace(' ', '-')}`}>
                {task.status} {/* Taskin durumunu gösterir */}
              </td>
              <td className="assignee">
                {task.assignee} {/* Taski atanan kişiyi gösterir */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HomeTasks;

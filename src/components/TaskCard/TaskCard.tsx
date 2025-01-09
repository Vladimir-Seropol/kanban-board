import React from 'react';
import { Task } from '../../types/task';

interface Props {
  task: Task;
}

const TaskCard: React.FC<Props> = ({ task }) => {
  return (
    <div className={`task-card ${task.endDay < Date.now() ? 'overdue' : ''}`}>
      <p>{task.text}</p>
    </div>
  );
};

export default TaskCard;

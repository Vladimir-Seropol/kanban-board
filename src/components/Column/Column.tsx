import React from "react";
import { TaskType } from "../../types/task";
import Task from "../Task/Task";

interface ColumnProps {
  title: string;
  icon: React.ReactNode;
  tasks: TaskType[];
  onUpdateTask: (updatedTask: TaskType) => void;
  isEditable: boolean;
  onDrop?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  children?: React.ReactNode;
}

const Column: React.FC<ColumnProps> = ({
  title,
  icon,
  tasks,
  onUpdateTask,
  isEditable,
  children,
  onDrop,
  onDragOver,
}) => {

  const sortedTasks = [...tasks].sort((a, b) => a.startDay - b.startDay);

  return (
    <div className="column" onDrop={onDrop} onDragOver={onDragOver}>
      <div className="column-header">
        <div className="column-header-icon">
          {icon}
          <h2>{title}</h2>
        </div>
        {children}
      </div>
      <div className="task-list">
        {sortedTasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            onUpdateTask={onUpdateTask}
            isEditable={isEditable}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;

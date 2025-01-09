import React, { useState } from "react";
import { TaskType } from "../../types/task";

interface TaskProps {
  task: TaskType;
  onUpdateTask: (updatedTask: TaskType) => void;
  isEditable: boolean;
}

const Task: React.FC<TaskProps> = ({ task, onUpdateTask, isEditable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<TaskType>({ ...task });

  
  const isOverdue = (endDay: number) => {
    const today = new Date();
    const endDate = new Date(endDay);
    return endDate < today;
  };

  
  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setEditedTask({ ...task });
  };
  const handleSave = () => {
    onUpdateTask(editedTask);
    setIsEditing(false);
  };

  const handleChange = (field: keyof TaskType, value: string) => {
    setEditedTask({ ...editedTask, [field]: value });
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("taskId", task.id.toString());
    e.dataTransfer.setData("taskType", task.type);
  };

 
  const overdueClass =
    isOverdue(Number(task.endDay)) && task.type !== "done" ? "overdue" : "";

  const overdueEndDateStyle =
    isOverdue(Number(task.endDay)) && task.type !== "done"
      ? { color: "#FC363999" }
      : {};

 
  const getValidDate = (timestamp: string | number) => {
    const date = new Date(Number(timestamp));
    return date.getTime() > 0 ? date : new Date(); 
  };

 
  if (isEditing) {
    return (
      <div className={`task ${overdueClass}`}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div>
            <label>Начало:</label>
            <input
              type="date"
              value={
                editedTask.startDay
                  ? getValidDate(editedTask.startDay).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                handleChange(
                  "startDay",
                  new Date(e.target.value).getTime().toString()
                )
              }
              required
            />
          </div>
          <div>
            <label>Окончание:</label>
            <input
              type="date"
              value={
                editedTask.endDay
                  ? getValidDate(editedTask.endDay).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                handleChange(
                  "endDay",
                  new Date(e.target.value).getTime().toString()
                )
              }
            />
          </div>
          <div>
            <label>Описание:</label>
            <input
              type="text"
              value={editedTask.text}
              onChange={(e) => handleChange("text", e.target.value)}
              required
            />
          </div>
          <div className="button-container">
            <button type="submit">
              <img src="/icons/Group (1).png" alt="" />
            </button>
            <button type="button" onClick={handleCancel}>
              <img src="/icons/Ellipse.png" alt="" />
            </button>
          </div>
        </form>
      </div>
    );
  }

 
  return (
    <div
      className={`task ${task.type || ""} ${overdueClass}`}
      draggable
      onDragStart={handleDragStart}
    >
      <p>
        <strong>Начало:</strong>{" "}
        {getValidDate(task.startDay).toLocaleDateString()}
      </p>
      <p>
        <strong>Окончание:</strong>{" "}
        <span style={overdueEndDateStyle}>
          {getValidDate(task.endDay).toLocaleDateString()}
        </span>
      </p>
      <p>
        <strong>Описание:</strong> {task.text}
      </p>
      <div className="button-container">
        {isEditable && (
          <button onClick={handleEdit}>
            <svg
              className="group"
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="20" cy="20" r="20" fill="white" fillOpacity="0.2" />
              <path
                d="M26.5793 10.9449C26.2042 10.57 25.6956 10.3594 25.1653 10.3594C24.6349 10.3594 24.1263 10.57 23.7512 10.9449L22.1063 12.5909L27.4093 17.8939L29.0543 16.2499C29.2401 16.0642 29.3874 15.8437 29.488 15.601C29.5886 15.3583 29.6403 15.0982 29.6403 14.8354C29.6403 14.5727 29.5886 14.3126 29.488 14.0699C29.3874 13.8272 29.2401 13.6067 29.0543 13.4209L26.5793 10.9449ZM25.9953 19.3079L20.6922 14.0049L11.8572 22.8399L10.7812 29.2199L17.1612 28.1429L25.9953 19.3079Z"
                fill="#FFFFFF"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Task;

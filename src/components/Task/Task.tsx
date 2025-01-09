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
                  ? getValidDate(editedTask.startDay)
                      .toISOString()
                      .split("T")[0]
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
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="20"
                  cy="20"
                  r="20"
                  fill="white"
                  fillOpacity="0.08"
                />
                <path
                  d="M16.2874 27.7365L9.3142 20.7633C8.89527 20.3444 8.89527 19.6651 9.3142 19.2462L10.8313 17.729C11.2503 17.31 11.9296 17.31 12.3485 17.729L17.046 22.4264L27.1075 12.365C27.5264 11.946 28.2057 11.946 28.6247 12.365L30.1418 13.8822C30.5607 14.3011 30.5607 14.9804 30.1418 15.3993L17.8046 27.7366C17.3856 28.1555 16.7063 28.1555 16.2874 27.7365Z"
                  fill="#0184CF"
                />
              </svg>
            </button>
            <button type="button" onClick={handleCancel}>
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="20"
                  cy="20"
                  r="20"
                  fill="white"
                  fillOpacity="0.08"
                />
                <path
                  d="M25.5368 12.9899C25.6939 12.8239 25.8826 12.691 26.0918 12.5992C26.3011 12.5074 26.5266 12.4584 26.7551 12.4552C26.9836 12.4521 27.2104 12.4947 27.4222 12.5807C27.6339 12.6667 27.8262 12.7942 27.9878 12.9558C28.1494 13.1174 28.277 13.3098 28.3629 13.5215C28.4489 13.7332 28.4916 13.96 28.4884 14.1885C28.4852 14.417 28.4363 14.6425 28.3444 14.8518C28.2526 15.0611 28.1197 15.2498 27.9537 15.4068L22.9444 20.4161C22.9378 20.4227 22.9325 20.4306 22.9289 20.4392C22.9253 20.4479 22.9235 20.4572 22.9235 20.4665C22.9235 20.4759 22.9253 20.4852 22.9289 20.4938C22.9325 20.5025 22.9378 20.5104 22.9444 20.517L27.9537 25.5263C28.1146 25.6845 28.2426 25.8731 28.3303 26.0811C28.4179 26.289 28.4635 26.5123 28.4645 26.738C28.4654 26.9637 28.4217 27.1873 28.3358 27.396C28.2499 27.6047 28.1235 27.7943 27.9639 27.9539C27.8043 28.1135 27.6147 28.2399 27.4061 28.3259C27.1974 28.4119 26.9738 28.4557 26.7481 28.4548C26.5224 28.4539 26.2991 28.4083 26.0911 28.3207C25.8832 28.2331 25.6946 28.1052 25.5363 27.9443L20.527 22.935C20.5204 22.9284 20.5125 22.9231 20.5038 22.9195C20.4952 22.9159 20.4859 22.9141 20.4765 22.9141C20.4672 22.9141 20.4579 22.9159 20.4492 22.9195C20.4406 22.9231 20.4327 22.9284 20.4261 22.935L15.4168 27.9443C15.2585 28.1052 15.07 28.2332 14.862 28.3208C14.6541 28.4085 14.4308 28.4541 14.2051 28.4551C13.9794 28.456 13.7558 28.4123 13.5471 28.3263C13.3384 28.2404 13.1488 28.114 12.9892 27.9545C12.8296 27.7949 12.7031 27.6053 12.6172 27.3966C12.5312 27.188 12.4874 26.9643 12.4883 26.7387C12.4892 26.513 12.5348 26.2897 12.6224 26.0817C12.71 25.8737 12.8379 25.6851 12.9988 25.5268L18.0081 20.5175C18.0147 20.5109 18.02 20.5031 18.0236 20.4944C18.0272 20.4858 18.029 20.4765 18.029 20.4671C18.029 20.4577 18.0272 20.4485 18.0236 20.4398C18.02 20.4312 18.0147 20.4233 18.0081 20.4167L12.9988 15.4074C12.6824 15.0859 12.5059 14.6525 12.5077 14.2014C12.5095 13.7504 12.6894 13.3184 13.0083 12.9994C13.3272 12.6805 13.7592 12.5004 14.2102 12.4986C14.6612 12.4967 15.0947 12.6731 15.4162 12.9893L20.4255 17.9986C20.4321 18.0053 20.44 18.0105 20.4487 18.0141C20.4573 18.0177 20.4666 18.0196 20.476 18.0196C20.4853 18.0196 20.4946 18.0177 20.5033 18.0141C20.5119 18.0105 20.5198 18.0053 20.5264 17.9986L25.5368 12.9899Z"
                  fill="white"
                  fillOpacity="0.7"
                />
              </svg>
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

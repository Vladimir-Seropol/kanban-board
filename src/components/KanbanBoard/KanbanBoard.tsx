import React, { useState, useEffect } from "react";
import Column from "../Column/Column";
import { TaskType } from "../../types/task";
import tasksData from "../../api/tasks.json";
import Task from "../Task/Task";

const KanbanBoard = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const todoIconUrl = "/icons/todo.svg";
  const inProgressIconUrl = "/icons/in_progress.svg";
  const reviewIconUrl = "/icons/review.svg";
  const doneIconUrl = "/icons/done.svg";

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks(tasksData as TaskType[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

 
  const updateTask = (updatedTask: TaskType) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };


  const addNewTask = (newTask: TaskType) => {
    setTasks((prev) => [...prev, newTask]);
    setIsAddingTask(false); 
  };

  const filterTasks = (task: TaskType) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const matchesText = task.text.toLowerCase().includes(lowerSearchTerm);
    const isDate = /^\d{2}\.\d{2}\.\d{4}$/.test(searchTerm);
  
    if (isDate) {
      const [day, month, year] = searchTerm.split(".").map(Number);
      const searchDate = new Date(year, month - 1, day); 

  

      const startDayDate = new Date(task.startDay);
      const endDayDate = new Date(task.endDay);
  
      return matchesText || 
             startDayDate.toDateString() === searchDate.toDateString() || 
             endDayDate.toDateString() === searchDate.toDateString();
    }
  
    return matchesText;
  };
  
  


  const todoTasks = tasks
    .filter((task) => task.type === "todo")
    .filter(filterTasks)
    .sort((a, b) => a.startDay - b.startDay);
  const inProgressTasks = tasks
    .filter((task) => task.type === "in_progress")
    .filter(filterTasks)
    .sort((a, b) => a.startDay - b.startDay);
  const reviewTasks = tasks
    .filter((task) => task.type === "review")
    .filter(filterTasks)
    .sort((a, b) => a.startDay - b.startDay);
  const doneTasks = tasks
    .filter((task) => task.type === "done")
    .filter(filterTasks)
    .sort((a, b) => a.startDay - b.startDay);

  if (loading) {
    return <p>Загрузка задач...</p>;
  }

  const deleteAllTasksInDone = () => {
    setTasks((prev) => prev.filter((task) => task.type !== "done"));
  };

  const handleDropTask = (taskId: number, newType: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, type: newType } : task
      )
    );
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnDeleteButton = (e: React.DragEvent) => {
    const taskId = parseInt(e.dataTransfer.getData("taskId"), 10);
    handleDeleteTask(taskId);
  };

  

  return (
    <div className="container">
      <div className="header">
        <h1>Your tasks</h1>
        <div>
          <label htmlFor="search">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.3831 12.4451C10.0351 13.5222 8.32581 14.0422 6.60631 13.8984C4.88682 13.7546 3.28765 12.9579 2.13727 11.6718C0.986879 10.3857 0.372596 8.70801 0.420583 6.98318C0.468569 5.25835 1.17518 3.61736 2.39529 2.39725C3.61541 1.17713 5.25639 0.470522 6.98122 0.422536C8.70606 0.374549 10.3838 0.988832 11.6699 2.13922C12.9559 3.28961 13.7527 4.88877 13.8965 6.60827C14.0403 8.32776 13.5202 10.0371 12.4431 11.3851L17.5991 16.5401C17.6728 16.6088 17.7319 16.6916 17.7729 16.7836C17.8139 16.8756 17.836 16.9749 17.8377 17.0756C17.8395 17.1763 17.821 17.2763 17.7833 17.3697C17.7455 17.4631 17.6894 17.5479 17.6182 17.6191C17.547 17.6903 17.4621 17.7465 17.3687 17.7842C17.2753 17.8219 17.1753 17.8405 17.0746 17.8387C16.9739 17.8369 16.8746 17.8149 16.7826 17.7739C16.6906 17.7329 16.6078 17.6738 16.5391 17.6001L11.3831 12.4451ZM3.45814 10.8831C2.72418 10.1491 2.22429 9.21392 2.02165 8.19586C1.81901 7.1778 1.92271 6.12253 2.31965 5.16339C2.71659 4.20425 3.38895 3.38431 4.25175 2.80719C5.11456 2.23007 6.12908 1.92167 7.16711 1.92097C8.20513 1.92027 9.22007 2.22731 10.0837 2.80327C10.9472 3.37923 11.6207 4.19826 12.0189 5.15686C12.4172 6.11546 12.5223 7.1706 12.321 8.18893C12.1197 9.20726 11.6211 10.1431 10.8881 10.8781L10.8831 10.8831L10.8781 10.8871C9.89323 11.8697 8.55856 12.4212 7.16731 12.4205C5.77605 12.4197 4.44198 11.8668 3.45814 10.8831Z"
                fill="white"
                fillOpacity="0.6"
              />
            </svg>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="поиск ..."
            />
          </label>
        </div>
      </div>
      <div className="kanban-board">
        <Column
          icon={<img src={todoIconUrl} alt="To Do Icon" />}
          title="To Do"
          tasks={todoTasks}
          onUpdateTask={updateTask}
          isEditable={true}
          onDrop={(e) => {
            const taskId = parseInt(e.dataTransfer.getData("taskId"), 10);
            handleDropTask(taskId, "todo");
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <button onClick={() => setIsAddingTask(true)}>
            <p className="add-task">+ Добавить</p>
          </button>
        </Column>

        <Column
          icon={<img src={inProgressIconUrl} alt="In Progress Icon" />}
          title="In Progress"
          tasks={inProgressTasks}
          onUpdateTask={updateTask}
          isEditable={false}
          onDrop={(e) => {
            const taskId = parseInt(e.dataTransfer.getData("taskId"), 10);
            handleDropTask(taskId, "in_progress");
          }}
          onDragOver={(e) => e.preventDefault()}
        />

        <Column
          icon={<img src={reviewIconUrl} alt="Review Icon" />}
          title="Review"
          tasks={reviewTasks}
          onUpdateTask={updateTask}
          isEditable={false}
          onDrop={(e) => {
            const taskId = parseInt(e.dataTransfer.getData("taskId"), 10);
            handleDropTask(taskId, "review");
          }}
          onDragOver={(e) => e.preventDefault()}
        />

        <Column
          icon={<img src={doneIconUrl} alt="Done Icon" />}
          title="Done"
          tasks={doneTasks}
          onUpdateTask={updateTask}
          isEditable={false}
          onDrop={(e) => {
            const taskId = parseInt(e.dataTransfer.getData("taskId"), 10);
            handleDropTask(taskId, "done");
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <button onClick={deleteAllTasksInDone} 
           onDragOver={handleDragOver}
           onDrop={handleDropOnDeleteButton}
          className="delete-button">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path className="delete-icon" 
                d="M18.7264 3.27586H14.0364V2.38586C14.0327 1.75568 13.7813 1.15224 13.3364 0.705863C13.1148 0.483488 12.8514 0.307154 12.5613 0.187016C12.2713 0.0668789 11.9603 0.00531256 11.6464 0.00586303H8.38641C8.07246 0.00531256 7.76152 0.0668789 7.47147 0.187016C7.18142 0.307154 6.91801 0.483488 6.69641 0.705863C6.25522 1.15386 6.00746 1.7571 6.00641 2.38586V3.27586H1.31641C1.11749 3.27586 0.926728 3.35488 0.786076 3.49553C0.645424 3.63618 0.566406 3.82695 0.566406 4.02586C0.566406 4.22478 0.645424 4.41554 0.786076 4.55619C0.926728 4.69685 1.11749 4.77586 1.31641 4.77586H2.73641V16.5359C2.73233 16.9916 2.8186 17.4437 2.99024 17.8659C3.16188 18.2882 3.41549 18.6722 3.73641 18.9959C4.39074 19.637 5.27034 19.996 6.18641 19.9959H13.8064C14.7225 19.996 15.6021 19.637 16.2564 18.9959C16.5773 18.6722 16.8309 18.2882 17.0026 17.8659C17.1742 17.4437 17.2605 16.9916 17.2564 16.5359V4.77586H18.6864C18.8853 4.77586 19.0761 4.69685 19.2167 4.55619C19.3574 4.41554 19.4364 4.22478 19.4364 4.02586C19.4364 3.82695 19.3574 3.63618 19.2167 3.49553C19.0761 3.35488 18.8853 3.27586 18.6864 3.27586H18.7264ZM7.52641 2.38586C7.52645 2.27044 7.54946 2.15618 7.5941 2.04973C7.63873 1.94329 7.70411 1.84679 7.78641 1.76586C7.95173 1.60236 8.17391 1.50919 8.40641 1.50586H11.6664C11.7834 1.50513 11.8994 1.52775 12.0076 1.5724C12.1158 1.61704 12.214 1.68281 12.2964 1.76586C12.4599 1.93118 12.5531 2.15337 12.5564 2.38586V3.27586H7.55641L7.52641 2.38586ZM8.85641 14.9959C8.85641 15.2611 8.75105 15.5154 8.56351 15.703C8.37598 15.8905 8.12162 15.9959 7.85641 15.9959C7.59119 15.9959 7.33684 15.8905 7.1493 15.703C6.96176 15.5154 6.85641 15.2611 6.85641 14.9959V9.56586C6.85641 9.30065 6.96176 9.04629 7.1493 8.85876C7.33684 8.67122 7.59119 8.56586 7.85641 8.56586C8.12162 8.56586 8.37598 8.67122 8.56351 8.85876C8.75105 9.04629 8.85641 9.30065 8.85641 9.56586V14.9959ZM13.2164 14.9959C13.2164 15.2611 13.111 15.5154 12.9235 15.703C12.736 15.8905 12.4816 15.9959 12.2164 15.9959C11.9512 15.9959 11.6968 15.8905 11.5093 15.703C11.3218 15.5154 11.2164 15.2611 11.2164 14.9959V9.56586C11.2164 9.30065 11.3218 9.04629 11.5093 8.85876C11.6968 8.67122 11.9512 8.56586 12.2164 8.56586C12.4816 8.56586 12.736 8.67122 12.9235 8.85876C13.111 9.04629 13.2164 9.30065 13.2164 9.56586V14.9959Z"
                fill="white"
                fillOpacity="0.8"
              />
            </svg>
          </button>
        </Column>
      </div>

      {isAddingTask && (
        <div className="modal-overlay">
          <div className="modal">
            <button
              className="modal-close"
              onClick={() => setIsAddingTask(false)}
            >
              &times;
            </button>
            <Task
              task={{
                id: Date.now(),
                text: "",
                startDay: new Date().getTime(),
                endDay: new Date().getTime(),
                type: "todo",
              }}
              onUpdateTask={addNewTask}
              isEditable={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;

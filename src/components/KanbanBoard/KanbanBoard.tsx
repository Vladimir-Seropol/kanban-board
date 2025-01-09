import React, { useState, useEffect } from "react";
import Column from "../Column/Column";
import { TaskType } from "../../types/task";
import tasksData from "../../../public/tasks.json";
import Task from "../Task/Task";


const KanbanBoard = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");


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

      return (
        matchesText ||
        startDayDate.toDateString() === searchDate.toDateString() ||
        endDayDate.toDateString() === searchDate.toDateString()
      );
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
          icon={
            <svg
              className="icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.486 2 2 6.486 2 12C2 17.514 6.486 22 12 22C17.514 22 22 17.514 22 12C22 6.486 17.514 2 12 2ZM15.493 8C15.6924 7.99491 15.8908 8.02979 16.0765 8.10259C16.2621 8.17538 16.4314 8.28463 16.5742 8.42387C16.717 8.56311 16.8304 8.72954 16.9079 8.91333C16.9853 9.09712 17.0252 9.29457 17.0251 9.49401C17.0251 9.69346 16.9851 9.89088 16.9075 10.0746C16.8299 10.2584 16.7163 10.4247 16.5735 10.5639C16.4306 10.703 16.2613 10.8121 16.0755 10.8848C15.8898 10.9575 15.6914 10.9922 15.492 10.987C15.1026 10.9768 14.7326 10.8149 14.4608 10.5358C14.189 10.2567 14.037 9.88255 14.0371 9.49301C14.0373 9.10347 14.1895 8.72939 14.4615 8.45049C14.7335 8.17159 15.1036 8.00995 15.493 8ZM8.5 8C8.69705 8.00007 8.89215 8.03894 9.07418 8.11441C9.2562 8.18988 9.42158 8.30046 9.56087 8.43984C9.70016 8.57922 9.81063 8.74467 9.88597 8.92675C9.96132 9.10882 10.0001 9.30395 10 9.501C9.99993 9.69805 9.96106 9.89315 9.88559 10.0752C9.81012 10.2572 9.69954 10.4226 9.56016 10.5619C9.42078 10.7012 9.25533 10.8116 9.07325 10.887C8.89118 10.9623 8.69605 11.0011 8.499 11.001C8.10104 11.0009 7.71944 10.8427 7.43813 10.5612C7.15683 10.2797 6.99887 9.89796 6.999 9.5C6.99913 9.10204 7.15735 8.72044 7.43884 8.43913C7.72033 8.15783 8.10204 7.99987 8.5 8ZM12 18C7 18 6 13 6 13H18C18 13 17 18 12 18Z"
                fill="white"
                fillOpacity="0.8"
              />
            </svg>
          }
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
          icon={
            <svg
              className="icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.514 22 22 17.514 22 12C22 6.486 17.514 2 12 2C6.486 2 2 6.486 2 12C2 17.514 6.486 22 12 22ZM15.493 9C15.6924 8.99491 15.8908 9.02979 16.0765 9.10259C16.2621 9.17538 16.4314 9.28463 16.5742 9.42387C16.717 9.56311 16.8304 9.72954 16.9079 9.91333C16.9853 10.0971 17.0252 10.2946 17.0251 10.494C17.0251 10.6935 16.9851 10.8909 16.9075 11.0746C16.8299 11.2584 16.7163 11.4247 16.5735 11.5639C16.4306 11.703 16.2613 11.8121 16.0755 11.8848C15.8898 11.9575 15.6914 11.9922 15.492 11.987C15.1026 11.9768 14.7326 11.8149 14.4608 11.5358C14.189 11.2567 14.037 10.8826 14.0371 10.493C14.0373 10.1035 14.1895 9.72939 14.4615 9.45049C14.7335 9.17159 15.1036 9.00995 15.493 9ZM11.192 15.919C11.7253 16.0262 12.2747 16.0262 12.808 15.919C13.062 15.8663 13.312 15.7887 13.558 15.686C13.792 15.586 14.022 15.462 14.237 15.318C14.4457 15.1753 14.6427 15.0123 14.828 14.829C15.0113 14.6463 15.1743 14.449 15.317 14.237L16.975 15.354C16.5445 15.9933 15.9948 16.5437 15.356 16.975C14.7057 17.4139 13.9755 17.7211 13.207 17.879C12.4103 18.0395 11.5896 18.0391 10.793 17.878C10.0241 17.7228 9.29385 17.4158 8.645 16.975C8.00699 16.5417 7.45694 15.9913 7.024 15.353L8.682 14.236C8.826 14.448 8.98867 14.6447 9.17 14.826C9.72255 15.3803 10.4256 15.7603 11.192 15.919ZM8.5 9C8.69705 9.00007 8.89215 9.03894 9.07418 9.11441C9.2562 9.18988 9.42158 9.30046 9.56087 9.43984C9.70016 9.57922 9.81063 9.74467 9.88597 9.92675C9.96132 10.1088 10.0001 10.304 10 10.501C9.99993 10.698 9.96106 10.8932 9.88559 11.0752C9.81012 11.2572 9.69954 11.4226 9.56016 11.5619C9.42078 11.7012 9.25533 11.8116 9.07325 11.887C8.89118 11.9623 8.69605 12.0011 8.499 12.001C8.10104 12.0009 7.71944 11.8427 7.43813 11.5612C7.15683 11.2797 6.99887 10.898 6.999 10.5C6.99913 10.102 7.15735 9.72044 7.43884 9.43913C7.72033 9.15783 8.10204 8.99987 8.5 9Z"
                fill="white"
                fillOpacity="0.8"
              />
            </svg>
          }
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
          icon={
            <svg
              className="icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.486 2 2 6.486 2 12C2 17.514 6.486 22 12 22C17.514 22 22 17.514 22 12C22 6.486 17.514 2 12 2ZM8.507 15C8.30762 15.0051 8.10923 14.9702 7.92355 14.8974C7.73786 14.8246 7.56863 14.7154 7.42583 14.5761C7.28303 14.4369 7.16956 14.2705 7.09211 14.0867C7.01466 13.9029 6.97479 13.7054 6.97485 13.506C6.97492 13.3065 7.01492 13.1091 7.0925 12.9254C7.17008 12.7416 7.28366 12.5753 7.42655 12.4361C7.56944 12.297 7.73874 12.1879 7.92448 12.1152C8.11021 12.0425 8.30862 12.0078 8.508 12.013C8.89741 12.0232 9.26743 12.1851 9.5392 12.4642C9.81097 12.7433 9.96298 13.1174 9.96285 13.507C9.96272 13.8965 9.81045 14.2706 9.5385 14.5495C9.26654 14.8284 8.89641 14.9901 8.507 15ZM12.808 8.081C12.2747 7.97379 11.7253 7.97379 11.192 8.081C10.9346 8.13381 10.6831 8.21186 10.441 8.314C10.207 8.414 9.978 8.538 9.763 8.682C9.33835 8.97177 8.97198 9.33881 8.683 9.764L7.024 8.646C7.67534 7.68152 8.59187 6.92614 9.663 6.471C10.0266 6.31752 10.4044 6.20029 10.791 6.121C11.588 5.96006 12.409 5.96006 13.206 6.121C13.9749 6.27622 14.7051 6.5832 15.354 7.024C15.992 7.45733 16.5421 8.00772 16.975 8.646L15.317 9.763C15.1736 9.55118 15.0102 9.35361 14.829 9.173C14.2766 8.61923 13.5739 8.23957 12.808 8.081ZM15.5 15C15.102 14.9999 14.7204 14.8417 14.4391 14.5602C14.1578 14.2787 13.9999 13.897 14 13.499C14.0001 13.101 14.1583 12.7194 14.4398 12.4381C14.7213 12.1568 15.103 11.9989 15.501 11.999C15.899 11.9991 16.2806 12.1573 16.5619 12.4388C16.8432 12.7203 17.0011 13.102 17.001 13.5C17.0009 13.898 16.8427 14.2796 16.5612 14.5609C16.2797 14.8422 15.898 15.0001 15.5 15Z"
                fill="white"
                fillOpacity="0.8"
              />
            </svg>
          }
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
          icon={
            <svg className="icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 11V19H3.051C3.296 20.692 4.741 22 6.5 22C7.674 22 8.574 21.583 9.172 20.826C9.54388 21.1994 9.98605 21.4954 10.473 21.697C10.9599 21.8985 11.4819 22.0016 12.0089 22.0003C12.5359 21.999 13.0574 21.8934 13.5433 21.6894C14.0293 21.4854 14.47 21.1872 14.84 20.812C15.441 21.574 16.344 22 17.5 22C19.43 22 21 20.43 21 18.5V11C21 6.038 16.963 2 12 2C7.037 2 3 6.038 3 11ZM9 12C7.897 12 7 11.103 7 10C7 8.897 7.897 8 9 8C10.103 8 11 8.897 11 10C11 11.103 10.103 12 9 12ZM15 8C16.103 8 17 8.897 17 10C17 11.103 16.103 12 15 12C13.897 12 13 11.103 13 10C13 8.897 13.897 8 15 8Z"
                fill="white"
                fillOpacity="0.8"
              />
            </svg>
          }
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
          <button
            onClick={deleteAllTasksInDone}
            onDragOver={handleDragOver}
            onDrop={handleDropOnDeleteButton}
            className="delete-button"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="delete-icon"
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

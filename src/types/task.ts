export interface Task {
    id: number;
    type: 'todo' | 'in_progress' | 'review' | 'done';
    startDay: number;
    endDay: number;
    text: string;
  }
 
export interface TaskType {
    id: number;
    text: string;
    startDay: number;
    endDay: number;  
    type: string;     
  }
  
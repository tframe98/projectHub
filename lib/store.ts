import { create } from 'zustand';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  progress: number;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

interface ProjectStore {
  projects: Project[];
  currentProject: Project | null;
  sidebarOpen: boolean;
  view: 'dashboard' | 'kanban' | 'analytics';
  
  // Actions
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (project: Project | null) => void;
  addTask: (projectId: string, task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (projectId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  moveTask: (projectId: string, taskId: string, newStatus: Task['status']) => void;
  toggleSidebar: () => void;
  setView: (view: 'dashboard' | 'kanban' | 'analytics') => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website with modern design and improved UX',
    status: 'active',
    progress: 65,
    tasks: [
      {
        id: '1',
        title: 'Design System Setup',
        description: 'Create comprehensive design system with components and guidelines',
        status: 'done',
        priority: 'high',
        assignee: 'Sarah Chen',
        dueDate: '2024-01-15',
        createdAt: '2024-01-01',
      },
      {
        id: '2',
        title: 'Homepage Wireframes',
        description: 'Create wireframes for the new homepage layout',
        status: 'in-progress',
        priority: 'high',
        assignee: 'Mike Johnson',
        dueDate: '2024-01-20',
        createdAt: '2024-01-02',
      },
      {
        id: '3',
        title: 'Content Migration',
        description: 'Migrate existing content to new CMS structure',
        status: 'todo',
        priority: 'medium',
        assignee: 'Lisa Wang',
        dueDate: '2024-01-25',
        createdAt: '2024-01-03',
      },
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-10',
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Develop a cross-platform mobile app for iOS and Android',
    status: 'active',
    progress: 35,
    tasks: [
      {
        id: '4',
        title: 'API Integration',
        description: 'Integrate backend APIs with the mobile app',
        status: 'in-progress',
        priority: 'high',
        assignee: 'Alex Rodriguez',
        dueDate: '2024-02-01',
        createdAt: '2024-01-05',
      },
      {
        id: '5',
        title: 'UI/UX Design',
        description: 'Design user interface and user experience flows',
        status: 'review',
        priority: 'medium',
        assignee: 'Emma Davis',
        dueDate: '2024-01-30',
        createdAt: '2024-01-06',
      },
    ],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-12',
  },
  {
    id: '3',
    name: 'Marketing Campaign',
    description: 'Launch Q1 marketing campaign across all channels',
    status: 'on-hold',
    progress: 20,
    tasks: [
      {
        id: '6',
        title: 'Campaign Strategy',
        description: 'Develop comprehensive marketing strategy and messaging',
        status: 'done',
        priority: 'high',
        assignee: 'David Kim',
        dueDate: '2024-01-10',
        createdAt: '2024-01-08',
      },
      {
        id: '7',
        title: 'Content Creation',
        description: 'Create marketing materials and content assets',
        status: 'todo',
        priority: 'medium',
        assignee: 'Rachel Green',
        dueDate: '2024-01-20',
        createdAt: '2024-01-09',
      },
    ],
    createdAt: '2024-01-08',
    updatedAt: '2024-01-11',
  },
];

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: initialProjects,
  currentProject: null,
  sidebarOpen: false,
  view: 'dashboard',

  addProject: (project) => {
    const newProject: Project = {
      ...project,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({
      projects: [...state.projects, newProject],
    }));
  },

  updateProject: (id, updates) => {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id
          ? { ...project, ...updates, updatedAt: new Date().toISOString() }
          : project
      ),
    }));
  },

  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject,
    }));
  },

  setCurrentProject: (project) => {
    set({ currentProject: project });
  },

  addTask: (projectId, task) => {
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? { ...project, tasks: [...project.tasks, newTask] }
          : project
      ),
    }));
  },

  updateTask: (projectId, taskId, updates) => {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId ? { ...task, ...updates } : task
              ),
            }
          : project
      ),
    }));
  },

  deleteTask: (projectId, taskId) => {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.filter((task) => task.id !== taskId),
            }
          : project
      ),
    }));
  },

  moveTask: (projectId, taskId, newStatus) => {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId ? { ...task, status: newStatus } : task
              ),
            }
          : project
      ),
    }));
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  setView: (view) => {
    set({ view });
  },
})); 
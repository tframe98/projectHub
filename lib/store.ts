import { create } from 'zustand';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  department?: string;
  addedAt: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  description: string;
  type: 'meeting' | 'deadline' | 'milestone' | 'review';
  date: string;
  time: string;
  duration: number;
  attendees: string[];
  location?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  progress: number;
  tasks: Task[];
  columns: Column[];
  teamMembers: TeamMember[];
  scheduleEvents: ScheduleEvent[];
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  color: string;
  order: number;
}

interface ProjectStore {
  projects: Project[];
  currentProject: Project | null;
  view: 'dashboard' | 'kanban' | 'analytics' | 'calendar' | 'team';
  sidebarOpen: boolean;
  
  // Actions
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  setView: (view: 'dashboard' | 'kanban' | 'analytics' | 'calendar' | 'team') => void;
  toggleSidebar: () => void;
  
  // Project actions
  addProject: (project: Omit<Project, 'id' | 'updatedAt' | 'columns' | 'teamMembers' | 'scheduleEvents'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Task actions
  addTask: (projectId: string, task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (projectId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  moveTask: (projectId: string, taskId: string, newStatus: string) => void;
  
  // Column actions
  addColumn: (projectId: string, column: Omit<Column, 'id' | 'order'>) => void;
  updateColumn: (projectId: string, columnId: string, updates: Partial<Column>) => void;
  deleteColumn: (projectId: string, columnId: string) => void;
  reorderColumns: (projectId: string, columnIds: string[]) => void;
  
  // Team actions
  addTeamMember: (projectId: string, member: Omit<TeamMember, 'id' | 'addedAt'>) => void;
  updateTeamMember: (projectId: string, memberId: string, updates: Partial<TeamMember>) => void;
  deleteTeamMember: (projectId: string, memberId: string) => void;
  
  // Schedule actions
  addScheduleEvent: (projectId: string, event: Omit<ScheduleEvent, 'id' | 'createdAt'>) => void;
  updateScheduleEvent: (projectId: string, eventId: string, updates: Partial<ScheduleEvent>) => void;
  deleteScheduleEvent: (projectId: string, eventId: string) => void;
}

// Default columns for new projects
const defaultColumns: Column[] = [
  { id: 'todo', title: 'To Do', color: 'bg-muted', order: 0 },
  { id: 'in-progress', title: 'In Progress', color: 'bg-primary', order: 1 },
  { id: 'review', title: 'Review', color: 'bg-muted', order: 2 },
  { id: 'done', title: 'Done', color: 'bg-primary', order: 3 },
];

// Sample data
const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Company website with modern design and improved UX',
    status: 'active',
    progress: 65,
    columns: [...defaultColumns],
    teamMembers: [
      {
        id: '1',
        name: 'Emma Davis',
        email: 'emma.davis@company.com',
        role: 'admin',
        department: 'Design',
        addedAt: '2024-01-15',
      },
      {
        id: '2',
        name: 'Alex Rodriguez',
        email: 'alex.rodriguez@company.com',
        role: 'member',
        department: 'Development',
        addedAt: '2024-01-16',
      },
    ],
    scheduleEvents: [
      {
        id: '1',
        title: 'Design Review Meeting',
        description: 'Review the homepage design with stakeholders',
        type: 'meeting',
        date: '2024-01-25',
        time: '14:00',
        duration: 60,
        attendees: ['emma.davis@company.com', 'alex.rodriguez@company.com'],
        location: 'Conference Room A',
        createdAt: '2024-01-20',
      },
      {
        id: '2',
        title: 'Content Deadline',
        description: 'Final content submission deadline',
        type: 'deadline',
        date: '2024-01-30',
        time: '17:00',
        duration: 0,
        attendees: ['rachel.green@company.com'],
        createdAt: '2024-01-21',
      },
    ],
    tasks: [
      {
        id: '1',
        title: 'Design Homepage',
        description: 'Create modern homepage design with responsive layout',
        status: 'in-progress',
        priority: 'high',
        assignee: 'Emma Davis',
        dueDate: '2024-01-29',
        createdAt: '2024-01-15',
      },
      {
        id: '2',
        title: 'Content Creation',
        description: 'Write compelling copy for all pages',
        status: 'todo',
        priority: 'medium',
        assignee: 'Rachel Green',
        dueDate: '2024-01-19',
        createdAt: '2024-01-16',
      },
      {
        id: '3',
        title: 'API Integration',
        description: 'Integrate backend APIs with frontend',
        status: 'review',
        priority: 'high',
        assignee: 'Alex Rodriguez',
        dueDate: '2024-01-31',
        createdAt: '2024-01-17',
      },
    ],
    updatedAt: '2024-01-20',
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Mobile app for iOS and Android',
    status: 'active',
    progress: 35,
    columns: [...defaultColumns],
    teamMembers: [
      {
        id: '3',
        name: 'David Kim',
        email: 'david.kim@company.com',
        role: 'admin',
        department: 'Development',
        addedAt: '2024-01-18',
      },
    ],
    scheduleEvents: [
      {
        id: '3',
        title: 'App Architecture Review',
        description: 'Review the mobile app architecture with the development team',
        type: 'meeting',
        date: '2024-01-28',
        time: '10:00',
        duration: 90,
        attendees: ['david.kim@company.com', 'emma.davis@company.com'],
        location: 'Zoom',
        createdAt: '2024-01-22',
      },
    ],
    tasks: [
      {
        id: '4',
        title: 'UI/UX Design',
        description: 'Design mobile app interface and user experience',
        status: 'in-progress',
        priority: 'medium',
        assignee: 'Emma Davis',
        dueDate: '2024-01-29',
        createdAt: '2024-01-18',
      },
      {
        id: '5',
        title: 'Backend Development',
        description: 'Develop server-side APIs and database',
        status: 'todo',
        priority: 'high',
        assignee: 'David Kim',
        dueDate: '2024-02-15',
        createdAt: '2024-01-19',
      },
    ],
    updatedAt: '2024-01-21',
  },
  {
    id: '3',
    name: 'Marketing Campaign',
    description: 'Campaign across all channels',
    status: 'on-hold',
    progress: 20,
    columns: [...defaultColumns],
    teamMembers: [
      {
        id: '4',
        name: 'Rachel Green',
        email: 'rachel.green@company.com',
        role: 'member',
        department: 'Marketing',
        addedAt: '2024-01-20',
      },
    ],
    scheduleEvents: [
      {
        id: '4',
        title: 'Campaign Strategy Review',
        description: 'Review marketing campaign strategy and timeline',
        type: 'review',
        date: '2024-02-05',
        time: '15:00',
        duration: 60,
        attendees: ['rachel.green@company.com', 'david.kim@company.com'],
        location: 'Conference Room B',
        createdAt: '2024-01-23',
      },
    ],
    tasks: [
      {
        id: '6',
        title: 'Campaign Strategy',
        description: 'Develop comprehensive marketing strategy',
        status: 'done',
        priority: 'high',
        assignee: 'David Kim',
        dueDate: '2024-01-09',
        createdAt: '2024-01-10',
      },
      {
        id: '7',
        title: 'Content Migration',
        description: 'Migrate existing content to new platform',
        status: 'todo',
        priority: 'low',
        assignee: 'Rachel Green',
        dueDate: '2024-02-01',
        createdAt: '2024-01-22',
      },
    ],
    updatedAt: '2024-01-22',
  },
];

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: sampleProjects,
  currentProject: null,
  view: 'dashboard',
  sidebarOpen: true,

  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),
  setView: (view) => set({ view }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  addProject: (projectData) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      columns: [...defaultColumns],
      teamMembers: [],
      scheduleEvents: [],
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ projects: [...state.projects, newProject] }));
  },

  updateProject: (id, updates) => {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id ? { ...project, ...updates, updatedAt: new Date().toISOString() } : project
      ),
    }));
  },

  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject,
    }));
  },

  addTask: (projectId, taskData) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: [...project.tasks, newTask],
              updatedAt: new Date().toISOString(),
            }
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
              updatedAt: new Date().toISOString(),
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
              updatedAt: new Date().toISOString(),
            }
          : project
      ),
    }));
  },

  moveTask: (projectId, taskId, newStatus) => {
    console.log('Moving task:', { projectId, taskId, newStatus });
    set((state) => {
      const updatedProjects = state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId ? { ...task, status: newStatus } : task
              ),
              updatedAt: new Date().toISOString(),
            }
          : project
      );
      
      // Update currentProject if it's the one being modified
      const updatedCurrentProject = state.currentProject?.id === projectId 
        ? updatedProjects.find(p => p.id === projectId) || null
        : state.currentProject;
      
      console.log('Updated projects:', updatedProjects);
      console.log('Updated current project:', updatedCurrentProject);
      
      return {
        projects: updatedProjects,
        currentProject: updatedCurrentProject,
      };
    });
  },

  addColumn: (projectId, columnData) => {
    console.log('Adding column:', { projectId, columnData });
    const newColumn: Column = {
      ...columnData,
      id: Date.now().toString(),
      order: get().projects.find(p => p.id === projectId)?.columns.length || 0,
    };
    
    set((state) => {
      const updatedProjects = state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              columns: [...project.columns, newColumn],
              updatedAt: new Date().toISOString(),
            }
          : project
      );
      
      // Update currentProject if it's the one being modified
      const updatedCurrentProject = state.currentProject?.id === projectId 
        ? updatedProjects.find(p => p.id === projectId) || null
        : state.currentProject;
      
      console.log('Added column, updated projects:', updatedProjects);
      console.log('Updated current project:', updatedCurrentProject);
      
      return {
        projects: updatedProjects,
        currentProject: updatedCurrentProject,
      };
    });
  },

  updateColumn: (projectId, columnId, updates) => {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              columns: project.columns.map((column) =>
                column.id === columnId ? { ...column, ...updates } : column
              ),
              updatedAt: new Date().toISOString(),
            }
          : project
      ),
    }));
  },

  deleteColumn: (projectId, columnId) => {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              columns: project.columns.filter((column) => column.id !== columnId),
              updatedAt: new Date().toISOString(),
            }
          : project
      ),
    }));
  },

  reorderColumns: (projectId, columnIds) => {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              columns: columnIds.map((columnId, index) => {
                const column = project.columns.find(c => c.id === columnId);
                return column ? { ...column, order: index } : column;
              }).filter(Boolean) as Column[],
              updatedAt: new Date().toISOString(),
            }
          : project
      ),
    }));
  },

  addTeamMember: (projectId, memberData) => {
    const newMember: TeamMember = {
      ...memberData,
      id: Date.now().toString(),
      addedAt: new Date().toISOString(),
    };
    
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              teamMembers: [...project.teamMembers, newMember],
              updatedAt: new Date().toISOString(),
            }
          : project
      ),
    }));
  },

  updateTeamMember: (projectId, memberId, updates) => {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              teamMembers: project.teamMembers.map((member) =>
                member.id === memberId ? { ...member, ...updates } : member
              ),
              updatedAt: new Date().toISOString(),
            }
          : project
      ),
    }));
  },

  deleteTeamMember: (projectId, memberId) => {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              teamMembers: project.teamMembers.filter((member) => member.id !== memberId),
              updatedAt: new Date().toISOString(),
            }
          : project
      ),
    }));
  },

  addScheduleEvent: (projectId, eventData) => {
    const newEvent: ScheduleEvent = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              scheduleEvents: [...project.scheduleEvents, newEvent],
              updatedAt: new Date().toISOString(),
            }
          : project
      ),
    }));
  },

  updateScheduleEvent: (projectId, eventId, updates) => {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              scheduleEvents: project.scheduleEvents.map((event) =>
                event.id === eventId ? { ...event, ...updates } : event
              ),
              updatedAt: new Date().toISOString(),
            }
          : project
      ),
    }));
  },

  deleteScheduleEvent: (projectId, eventId) => {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              scheduleEvents: project.scheduleEvents.filter((event) => event.id !== eventId),
              updatedAt: new Date().toISOString(),
            }
          : project
      ),
    }));
  },
})); 
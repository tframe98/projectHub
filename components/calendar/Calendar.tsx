'use client';

import React, { useState } from 'react';
import { useProjectStore } from '@/lib/store';
import { Calendar as CalendarIcon, Clock, MapPin, Users, AlertCircle, CheckCircle, Activity } from 'lucide-react';

export default function Calendar() {
  const { projects } = useProjectStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'list'>('month');

  // Get all events and tasks
  const allEvents = projects.flatMap(project => [
    ...project.scheduleEvents.map(event => ({
      ...event,
      projectName: project.name,
      type: 'event' as const,
      date: new Date(`${event.date}T${event.time}`),
    })),
    ...project.tasks.map(task => ({
      ...task,
      projectName: project.name,
      type: 'task' as const,
      date: new Date(task.dueDate),
      title: task.title,
      description: task.description,
    }))
  ]);

  // Get week start (Sunday) for selected date
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  // Get week dates
  const weekStart = getWeekStart(selectedDate);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    return date;
  });

  // Filter events for selected date
  const selectedDateEvents = allEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.toDateString() === selectedDate.toDateString();
  });

  // Get upcoming events (next 7 days)
  const upcomingEvents = allEvents
    .filter(event => {
      const eventDate = new Date(event.date);
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return eventDate >= today && eventDate <= nextWeek;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Get overdue tasks
  const overdueTasks = allEvents.filter(event => {
    if (event.type !== 'task') return false;
    const eventDate = new Date(event.date);
    const today = new Date();
    return eventDate < today && event.status !== 'done';
  });

  const getEventIcon = (event: any, viewType?: string) => {
    if (event.type === 'task') {
      switch (event.status) {
        case 'done':
          return <CheckCircle size={16} className={viewType === 'list' ? 'calendar-list-text' : 'text-green-500'} />;
        case 'in-progress':
          return <Activity size={16} className={viewType === 'list' ? 'calendar-list-text' : 'text-blue-500'} />;
        default:
          return <AlertCircle size={16} className={viewType === 'list' ? 'calendar-list-text' : 'text-orange-500'} />;
      }
    } else {
      switch (event.type) {
        case 'meeting':
          return <Users size={16} className={viewType === 'list' ? 'calendar-list-text' : 'text-blue-500'} />;
        case 'deadline':
          return <AlertCircle size={16} className={viewType === 'list' ? 'calendar-list-text' : 'text-red-500'} />;
        case 'milestone':
          return <CheckCircle size={16} className={viewType === 'list' ? 'calendar-list-text' : 'text-green-500'} />;
        case 'review':
          return <Activity size={16} className={viewType === 'list' ? 'calendar-list-text' : 'text-purple-500'} />;
        default:
          return <CalendarIcon size={16} className={viewType === 'list' ? 'calendar-list-text' : 'text-gray-500'} />;
      }
    }
  };

  const getEventColor = (event: any) => {
    if (event.type === 'task') {
      switch (event.status) {
        case 'done':
          return 'border-green-200 bg-green-50';
        case 'in-progress':
          return 'border-blue-200 bg-blue-50';
        default:
          return 'border-orange-200 bg-orange-50';
      }
    } else {
      switch (event.type) {
        case 'meeting':
          return 'border-blue-200 bg-blue-50';
        case 'deadline':
          return 'border-red-200 bg-red-50';
        case 'milestone':
          return 'border-green-200 bg-green-50';
        case 'review':
          return 'border-purple-200 bg-purple-50';
        default:
          return 'border-gray-200 bg-gray-50';
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-muted">
          View scheduled events and task due dates.
        </p>
      </div>

      {/* View Toggle */}
      <div className="flex space-x-2">
        <button
          onClick={() => setView('month')}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            view === 'month' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}
        >
          Month
        </button>
        <button
          onClick={() => setView('week')}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            view === 'week' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}
        >
          Week
        </button>
        <button
          onClick={() => setView('list')}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            view === 'list' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}
        >
          List
        </button>
      </div>

      {/* Date Selector */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => {
            const newDate = new Date(selectedDate);
            if (view === 'month') {
              newDate.setMonth(newDate.getMonth() - 1);
            } else if (view === 'week') {
              newDate.setDate(newDate.getDate() - 7);
            } else {
              newDate.setDate(newDate.getDate() - 1);
            }
            setSelectedDate(newDate);
          }}
          className="p-2 rounded-md hover:bg-muted"
        >
          ←
        </button>
        <h2 className="text-lg font-semibold">
          {view === 'month' 
            ? selectedDate.toLocaleDateString([], { month: 'long', year: 'numeric' })
            : view === 'week'
            ? `${weekStart.toLocaleDateString([], { month: 'short', day: 'numeric' })} - ${weekDates[6].toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}`
            : selectedDate.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })
          }
        </h2>
        <button
          onClick={() => {
            const newDate = new Date(selectedDate);
            if (view === 'month') {
              newDate.setMonth(newDate.getMonth() + 1);
            } else if (view === 'week') {
              newDate.setDate(newDate.getDate() + 7);
            } else {
              newDate.setDate(newDate.getDate() + 1);
            }
            setSelectedDate(newDate);
          }}
          className="p-2 rounded-md hover:bg-muted"
        >
          →
        </button>
      </div>

             {/* Calendar Grid */}
       {view === 'month' && (
         <div className="bg-surface border border-border rounded-lg p-6">
           <div className="grid grid-cols-7 gap-1 mb-4">
             {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
               <div key={day} className="text-center text-sm font-medium text-muted p-2">
                 {day}
               </div>
             ))}
           </div>
           <div className="grid grid-cols-7 gap-1">
             {Array.from({ length: 35 }, (_, i) => {
               const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
               date.setDate(date.getDate() - date.getDay() + i);
               
               const dayEvents = allEvents.filter(event => {
                 const eventDate = new Date(event.date);
                 return eventDate.toDateString() === date.toDateString();
               });

               return (
                 <div
                   key={i}
                   className={`min-h-[80px] p-2 border border-border ${
                     date.toDateString() === selectedDate.toDateString() 
                       ? 'bg-primary/10 border-primary' 
                       : ''
                   }`}
                 >
                   <div className="text-sm font-medium mb-1">
                     {date.getDate()}
                   </div>
                   <div className="space-y-1">
                     {dayEvents.slice(0, 2).map((event, index) => (
                       <div
                         key={index}
                         className={`text-xs p-1 rounded border ${getEventColor(event)}`}
                         title={`${event.title} - ${event.projectName}`}
                       >
                         <div className="flex items-center space-x-1">
                           {getEventIcon(event, view)}
                           <span className="truncate">{event.title}</span>
                         </div>
                       </div>
                     ))}
                     {dayEvents.length > 2 && (
                       <div className="text-xs text-muted text-center">
                         +{dayEvents.length - 2} more
                       </div>
                     )}
                   </div>
                 </div>
               );
             })}
           </div>
         </div>
       )}

       {/* Week View */}
       {view === 'week' && (
         <div className="bg-surface border border-border rounded-lg p-6">
           <div className="grid grid-cols-8 gap-1 mb-4">
             <div className="text-sm font-medium text-muted p-2"></div>
             {weekDates.map((date, index) => (
               <div key={index} className="text-center text-sm font-medium text-muted p-2">
                 <div>{date.toLocaleDateString([], { weekday: 'short' })}</div>
                 <div className="text-xs">{date.getDate()}</div>
               </div>
             ))}
           </div>
           <div className="grid grid-cols-8 gap-1">
             {/* Time slots */}
             {Array.from({ length: 24 }, (_, hour) => (
               <React.Fragment key={hour}>
                 <div className="text-xs text-muted p-1 text-right border-r border-border">
                   {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                 </div>
                 {weekDates.map((date, dayIndex) => {
                   const dayEvents = allEvents.filter(event => {
                     const eventDate = new Date(event.date);
                     const eventHour = eventDate.getHours();
                     return eventDate.toDateString() === date.toDateString() && eventHour === hour;
                   });

                   return (
                     <div
                       key={dayIndex}
                       className="min-h-[60px] p-1 border border-border relative"
                     >
                                                {dayEvents.map((event, eventIndex) => (
                           <div
                             key={eventIndex}
                             className={`text-xs p-1 rounded border ${getEventColor(event)} mb-1`}
                             title={`${event.title} - ${event.projectName}`}
                           >
                             <div className="flex items-center space-x-1">
                               {getEventIcon(event, view)}
                               <span className="truncate">{event.title}</span>
                             </div>
                           </div>
                         ))}
                     </div>
                   );
                 })}
               </React.Fragment>
             ))}
           </div>
         </div>
       )}

       {/* List View */}
       {view === 'list' && (
         <div className="bg-surface border border-border rounded-lg p-6">
           <div className="space-y-4">
             {allEvents
               .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
               .map((event, index) => (
                 <div
                   key={index}
                   className={`p-4 rounded-lg border calendar-list-text ${getEventColor(event)}`}
                 >
                   <div className="flex items-start justify-between">
                     <div className="flex items-start space-x-3">
                       {getEventIcon(event, view)}
                       <div className="flex-1">
                         <h4 className="font-medium">{event.title}</h4>
                         <p className="text-sm mt-1">{event.description}</p>
                         <div className="flex items-center space-x-4 mt-2 text-xs">
                           <span className="flex items-center space-x-1">
                             <CalendarIcon size={12} />
                             <span>{formatDate(new Date(event.date))}</span>
                           </span>
                           <span className="flex items-center space-x-1">
                             <Clock size={12} />
                             <span>{formatTime(new Date(event.date))}</span>
                           </span>
                           {event.location && (
                             <span className="flex items-center space-x-1">
                               <MapPin size={12} />
                               <span>{event.location}</span>
                             </span>
                           )}
                           <span className="text-primary font-medium">{event.projectName}</span>
                         </div>
                       </div>
                     </div>
                     <div className="text-xs">
                       {event.type === 'event' && event.duration > 0 && (
                         <span>{event.duration} min</span>
                       )}
                     </div>
                   </div>
                 </div>
               ))}
             {allEvents.length === 0 && (
               <p className="text-center py-8">No events scheduled</p>
             )}
           </div>
         </div>
       )}

             {/* Selected Date Events - Only show for month and week views */}
       {view !== 'list' && selectedDateEvents.length > 0 && (
         <div className="bg-surface border border-border rounded-lg p-6">
           <h3 className="text-lg font-semibold mb-4">
             Events for {formatDate(selectedDate)}
           </h3>
           <div className="space-y-3">
             {selectedDateEvents.map((event, index) => (
               <div
                 key={index}
                 className={`p-4 rounded-lg border ${getEventColor(event)}`}
               >
                                    <div className="flex items-start justify-between">
                     <div className="flex items-start space-x-3">
                       {getEventIcon(event, view)}
                       <div className="flex-1">
                         <h4 className="font-medium">{event.title}</h4>
                         <p className="text-sm text-muted mt-1">{event.description}</p>
                         <div className="flex items-center space-x-4 mt-2 text-xs text-muted">
                           <span className="flex items-center space-x-1">
                             <Clock size={12} />
                             <span>{formatTime(new Date(event.date))}</span>
                           </span>
                           {event.location && (
                             <span className="flex items-center space-x-1">
                               <MapPin size={12} />
                               <span>{event.location}</span>
                             </span>
                           )}
                           <span className="text-primary font-medium">{event.projectName}</span>
                         </div>
                       </div>
                     </div>
                     <div className="text-xs text-muted">
                       {event.type === 'event' && event.duration > 0 && (
                         <span>{event.duration} min</span>
                       )}
                     </div>
                   </div>
               </div>
             ))}
           </div>
         </div>
       )}

      {/* Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-surface border border-border rounded-lg p-6">
           <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
           <div className="space-y-3">
             {upcomingEvents.slice(0, 5).map((event, index) => (
               <div
                 key={index}
                 className={`p-3 rounded-lg border calendar-list-text ${getEventColor(event)}`}
               >
                 <div className="flex items-center space-x-3">
                   {getEventIcon(event, view)}
                   <div className="flex-1">
                     <h4 className="font-medium text-sm">{event.title}</h4>
                     <p className="text-xs mt-1">
                       {formatDate(new Date(event.date))} at {formatTime(new Date(event.date))}
                     </p>
                   </div>
                   <span className="text-xs text-primary font-medium">{event.projectName}</span>
                 </div>
               </div>
             ))}
             {upcomingEvents.length === 0 && (
               <p className="text-muted text-center py-4">No upcoming events</p>
             )}
           </div>
         </div>

        {/* Overdue Tasks */}
                 <div className="bg-surface border border-border rounded-lg p-6">
           <h3 className="text-lg font-semibold mb-4">Overdue Tasks</h3>
           <div className="space-y-3">
             {overdueTasks.slice(0, 5).map((task, index) => (
               <div
                 key={index}
                 className="p-3 rounded-lg border border-red-200 bg-red-50 calendar-list-text"
               >
                 <div className="flex items-center space-x-3">
                   <AlertCircle size={16} className="calendar-list-text" />
                   <div className="flex-1">
                     <h4 className="font-medium text-sm">{task.title}</h4>
                     <p className="text-xs mt-1">
                       Due {formatDate(new Date(task.date))}
                     </p>
                   </div>
                   <span className="text-xs text-primary font-medium">{task.projectName}</span>
                 </div>
               </div>
             ))}
             {overdueTasks.length === 0 && (
               <p className="text-muted text-center py-4">No overdue tasks</p>
             )}
           </div>
         </div>
      </div>
    </div>
  );
} 
// interviews.component.ts
import { Component, OnInit } from '@angular/core';
import {CommonModule} from  '@angular/common'
import {FormsModule} from '@angular/forms'

interface Interview {
  id: string;
  company: {
    name: string;
    logo: string;
    location?: string;
  };
  position: string;
  type: 'phone' | 'video' | 'onsite' | 'technical' | 'behavioral';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  date: Date;
  duration: number; // in minutes
  interviewers?: Interviewer[];
  notes?: string;
  feedback?: string;
  preparation?: string;
  questions?: InterviewQuestion[];
  documents?: Document[];
  followUp?: FollowUp; // Added missing comma here
}

interface Interviewer {
  name: string;
  title: string;
  avatar?: string;
  linkedIn?: string;
  notes?: string;
}

interface InterviewQuestion {
  question: string;
  notes?: string;
  answered?: boolean;
}

interface Document {
  name: string;
  type: string;
  size: string;
  url: string;
}

interface FollowUp {
  sent: boolean;
  date?: Date;
  content?: string;
}

interface InterviewFilter {
  status: 'all' | 'scheduled' | 'completed' | 'cancelled';
  type: 'all' | 'phone' | 'video' | 'onsite' | 'technical' | 'behavioral';
  date: 'all' | 'today' | 'tomorrow' | 'thisWeek' | 'nextWeek' | 'thisMonth';
}

@Component({
  selector: 'app-interviews',
  templateUrl: './interviews.component.html',
  styleUrls: ['./interviews.component.css'],
  imports:[CommonModule,FormsModule]
})
export class InterviewsComponent implements OnInit {
  interviews: Interview[] = [];
  filteredInterviews: Interview[] = [];
  selectedInterview: Interview | null = null;
  isAddingInterview: boolean = false;
  isEditingInterview: boolean = false;
  searchQuery: string = '';
  
  filters: InterviewFilter = {
    status: 'all',
    type: 'all',
    date: 'all'
  };
  
  constructor() { }
  
  ngOnInit(): void {
    this.loadInterviews();
    this.applyFilters();
    
    // Select first interview by default
    if (this.filteredInterviews.length > 0) {
      this.selectInterview(this.filteredInterviews[0].id);
    }
  }
  
  loadInterviews(): void {
    // In a real application, this would be an API call
    this.interviews = [
      {
        id: 'int1',
        company: {
          name: 'TechCorp Inc.',
          logo: '/api/placeholder/64/64',
          location: 'New York, NY (Remote)'
        },
        position: 'Senior Frontend Developer',
        type: 'video',
        status: 'scheduled',
        date: new Date('2025-04-24T14:00:00'),
        duration: 60,
        interviewers: [
          {
            name: 'Sarah Johnson',
            title: 'Technical Recruiter',
            avatar: '/api/placeholder/40/40'
          },
          {
            name: 'Mark Davis',
            title: 'Frontend Lead',
            avatar: '/api/placeholder/40/40'
          }
        ],
        preparation: `
- Review company products and recent news
- Prepare questions about team structure and work methodology
- Review Angular best practices and performance optimization techniques
- Complete coding challenge sent via email
        `,
        documents: [
          {
            name: 'TechCorp_Job_Description.pdf',
            type: 'PDF',
            size: '156KB',
            url: '#'
          },
          {
            name: 'Coding_Challenge.zip',
            type: 'ZIP',
            size: '2.3MB',
            url: '#'
          }
        ]
      },
      {
        id: 'int2',
        company: {
          name: 'InnoSoft Solutions',
          logo: '/api/placeholder/64/64',
          location: 'Chicago, IL'
        },
        position: 'React Developer Lead',
        type: 'technical',
        status: 'scheduled',
        date: new Date('2025-04-22T10:30:00'),
        duration: 90,
        interviewers: [
          {
            name: 'Michael Chen',
            title: 'Senior HR Manager',
            avatar: '/api/placeholder/40/40'
          },
          {
            name: 'Jessica Wong',
            title: 'CTO',
            avatar: '/api/placeholder/40/40'
          }
        ],
        notes: 'This is the technical round after passing the initial screening. Expect questions about React architecture, state management, and performance optimization.',
        preparation: `
- Review React hooks and context API
- Prepare examples of past projects with React
- Review system design principles for frontend applications
- Practice coding on whiteboard for algorithm questions
        `,
        questions: [
          {
            question: 'How would you manage state in a complex React application?',
            notes: 'Talk about Redux, Context API, and other state management approaches'
          },
          {
            question: 'Describe a challenging technical problem you solved',
            notes: 'Use the STAR method - Situation, Task, Action, Result'
          },
          {
            question: 'How do you approach performance optimization in React?',
            notes: 'Mention memoization, virtualization, code splitting, and lazy loading'
          }
        ]
      },
      {
        id: 'int3',
        company: {
          name: 'Google',
          logo: '/api/placeholder/64/64',
          location: 'Mountain View, CA (Remote)'
        },
        position: 'Senior Frontend Engineer',
        type: 'onsite',
        status: 'scheduled',
        date: new Date('2025-04-29T09:00:00'),
        duration: 300, // 5 hours
        interviewers: [
          {
            name: 'David Lee',
            title: 'Technical Recruiter',
            avatar: '/api/placeholder/40/40'
          },
          {
            name: 'Amanda Garcia',
            title: 'Engineering Manager',
            avatar: '/api/placeholder/40/40'
          },
          {
            name: 'Raj Patel',
            title: 'Senior Staff Engineer',
            avatar: '/api/placeholder/40/40'
          }
        ],
        notes: 'Full day virtual onsite consisting of 5 interviews: coding, system design, behavioral, and team fit. Lunch break will be provided.',
        preparation: `
- Review Google's interview process and expectations
- Practice coding challenges on LeetCode focusing on JavaScript
- Prepare system design examples for frontend applications
- Review projects for behavioral questions using STAR method
- Research Google's products and recent developments
        `,
        documents: [
          {
            name: 'Google_Interview_Schedule.pdf',
            type: 'PDF',
            size: '210KB',
            url: '#'
          },
          {
            name: 'Virtual_Onsite_Instructions.pdf',
            type: 'PDF',
            size: '180KB',
            url: '#'
          }
        ]
      },
      {
        id: 'int4',
        company: {
          name: 'Microsoft',
          logo: '/api/placeholder/64/64',
          location: 'Remote'
        },
        position: 'UI/UX Developer',
        type: 'phone',
        status: 'scheduled',
        date: new Date('2025-04-25T15:00:00'),
        duration: 45,
        interviewers: [
          {
            name: 'Alex Reynolds',
            title: 'Talent Acquisition',
            avatar: '/api/placeholder/40/40'
          }
        ],
        notes: 'Initial screening call to discuss background, experience, and determine fit for the position.',
        preparation: `
- Review job description and requirements
- Prepare questions about the team and role
- Review recent Microsoft products and design system
- Have portfolio ready to discuss specific projects
        `
      },
      {
        id: 'int5',
        company: {
          name: 'Facebook',
          logo: '/api/placeholder/64/64',
          location: 'Menlo Park, CA'
        },
        position: 'Frontend Developer',
        type: 'technical',
        status: 'completed',
        date: new Date('2025-04-15T13:00:00'),
        duration: 120,
        interviewers: [
          {
            name: 'Mark Thompson',
            title: 'Technical Recruiter',
            avatar: '/api/placeholder/40/40'
          },
          {
            name: 'Sophia Chen',
            title: 'Frontend Engineer',
            avatar: '/api/placeholder/40/40'
          }
        ],
        notes: 'Technical interview that included live coding and architectural discussion.',
        feedback: 'The interview went well. I was able to solve the coding challenges and explain my thought process. The interviewers seemed impressed with my approach to the architecture question. Currently waiting for feedback.',
        questions: [
          {
            question: 'Implement a debounce function in JavaScript',
            notes: 'Completed successfully',
            answered: true
          },
          {
            question: 'How would you design a real-time notification system?',
            notes: 'Discussed WebSockets, polling, and server-sent events',
            answered: true
          },
          {
            question: 'Explain the virtual DOM and its benefits',
            notes: 'Covered reconciliation, diffing algorithm, and performance benefits',
            answered: true
          }
        ],
        followUp: {
          sent: true,
          date: new Date('2025-04-16T09:30:00'),
          content: "Thank you for the opportunity to interview yesterday. I enjoyed learning more about the team and the challenges you're working on. I'm excited about the possibility of joining Facebook as a Frontend Developer."
        }
      },
      {
        id: 'int6',
        company: {
          name: 'Amazon',
          logo: '/api/placeholder/64/64',
          location: 'Seattle, WA (Remote)'
        },
        position: 'Frontend Developer II',
        type: 'behavioral',
        status: 'completed',
        date: new Date('2025-04-10T11:00:00'),
        duration: 60,
        interviewers: [
          {
            name: 'Jennifer Williams',
            title: 'HR Business Partner',
            avatar: '/api/placeholder/40/40'
          }
        ],
        notes: 'Behavioral interview focusing on Amazon leadership principles.',
        feedback: 'The interview focused heavily on customer obsession and ownership. I provided examples from my previous roles that demonstrated these principles. The interviewer seemed particularly interested in how I handled difficult situations with teammates.',
        questions: [
          {
            question: 'Tell me about a time when you faced a tight deadline',
            notes: 'Used STAR method with project X example',
            answered: true
          },
          {
            question: 'How do you handle receiving negative feedback?',
            notes: 'Discussed growth mindset and continuous improvement',
            answered: true
          },
          {
            question: 'Describe a time when you disagreed with your team',
            notes: 'Used example of architecture decision that had trade-offs',
            answered: true
          }
        ],
        followUp: {
          sent: true,
          date: new Date('2025-04-10T15:45:00'),
          content: "Thank you for the interview today. I appreciated the opportunity to discuss how my experiences align with Amazon's leadership principles. I'm excited about the possibility of contributing to the team."
        }
      },
      {
        id: 'int7',
        company: {
          name: 'StartupX',
          logo: '/api/placeholder/64/64',
          location: 'Remote'
        },
        position: 'Senior Frontend Engineer',
        type: 'video',
        status: 'cancelled',
        date: new Date('2025-04-16T09:00:00'),
        duration: 60,
        notes: 'Interview was cancelled because I accepted another offer. Sent email to thank them for the opportunity and explain the situation.'
      },
      {
        id: 'int8',
        company: {
          name: 'FinTech Inc.',
          logo: '/api/placeholder/64/64',
          location: 'Boston, MA'
        },
        position: 'UI Engineer',
        type: 'phone',
        status: 'rescheduled',
        date: new Date('2025-04-28T14:30:00'),
        duration: 45,
        interviewers: [
          {
            name: 'Robert Johnson',
            title: 'Hiring Manager',
            avatar: '/api/placeholder/40/40'
          }
        ],
        notes: 'Originally scheduled for April 18, rescheduled due to interviewer availability.',
        preparation: `
- Research financial industry UI/UX best practices
- Review company's products and competitors
- Prepare portfolio examples relevant to financial applications
- Prepare questions about team structure and development processes
        `
      }
    ];
  }
  
  selectInterview(id: string): void {
    const interview = this.interviews.find(i => i.id === id);
    this.selectedInterview = interview || null;
  }
  
  applyFilters(): void {
    let filtered = [...this.interviews];
    
    // Apply status filter
    if (this.filters.status !== 'all') {
      filtered = filtered.filter(i => i.status === this.filters.status);
    }
    
    // Apply type filter
    if (this.filters.type !== 'all') {
      filtered = filtered.filter(i => i.type === this.filters.type);
    }
    
    // Apply date filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const nextWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
    const thisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    if (this.filters.date !== 'all') {
      switch (this.filters.date) {
        case 'today':
          filtered = filtered.filter(i => {
            const interviewDate = new Date(i.date);
            return interviewDate.getDate() === today.getDate() && 
                   interviewDate.getMonth() === today.getMonth() && 
                   interviewDate.getFullYear() === today.getFullYear();
          });
          break;
        case 'tomorrow':
          filtered = filtered.filter(i => {
            const interviewDate = new Date(i.date);
            return interviewDate.getDate() === tomorrow.getDate() && 
                   interviewDate.getMonth() === tomorrow.getMonth() && 
                   interviewDate.getFullYear() === tomorrow.getFullYear();
          });
          break;
        case 'thisWeek':
          filtered = filtered.filter(i => {
            const interviewDate = new Date(i.date);
            return interviewDate >= today && interviewDate < nextWeek;
          });
          break;
        case 'nextWeek':
          filtered = filtered.filter(i => {
            const interviewDate = new Date(i.date);
            return interviewDate >= nextWeek && interviewDate < new Date(nextWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
          });
          break;
        case 'thisMonth':
          filtered = filtered.filter(i => {
            const interviewDate = new Date(i.date);
            return interviewDate >= today && interviewDate <= thisMonth;
          });
          break;
      }
    }
    
    // Apply search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(i => 
        i.company.name.toLowerCase().includes(query) || 
        i.position.toLowerCase().includes(query) ||
        (i.company.location && i.company.location.toLowerCase().includes(query))
      );
    }
    
    // Sort by date (upcoming first, then past)
    filtered.sort((a, b) => {
      // First, sort by status (scheduled first)
      if (a.status === 'scheduled' && b.status !== 'scheduled') return -1;
      if (a.status !== 'scheduled' && b.status === 'scheduled') return 1;
      
      // Then by date
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    
    this.filteredInterviews = filtered;
    
    // Reset selected interview if it's not in filtered results
    if (this.selectedInterview && !filtered.some(i => i.id === this.selectedInterview?.id)) {
      this.selectedInterview = filtered.length > 0 ? filtered[0] : null;
    }
  }
  
  openAddInterviewModal(): void {
    this.isAddingInterview = true;
  }
  
  closeAddInterviewModal(): void {
    this.isAddingInterview = false;
  }
  
  openEditInterviewModal(): void {
    this.isEditingInterview = true;
  }
  
  closeEditInterviewModal(): void {
    this.isEditingInterview = false;
  }
  
  toggleInterviewStatus(interview: Interview): void {
    // Toggle between scheduled and completed
    if (interview.status === 'scheduled') {
      interview.status = 'completed';
    } else if (interview.status === 'completed') {
      interview.status = 'scheduled';
    }
    
    this.applyFilters();
  }
  
  cancelInterview(interview: Interview): void {
    interview.status = 'cancelled';
    this.applyFilters();
  }
  
  rescheduleInterview(interview: Interview): void {
    interview.status = 'rescheduled';
    // In a real app, this would open a rescheduling modal
    this.applyFilters();
  }
  
  formatInterviewTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  formatInterviewDate(date: Date): string {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const interviewDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (interviewDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (interviewDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    }
  }
  
  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
    }
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'scheduled': return 'status-scheduled';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      case 'rescheduled': return 'status-rescheduled';
      default: return '';
    }
  }
  
  getTypeIcon(type: string): string {
    switch (type) {
      case 'phone': return 'fa-phone-alt';
      case 'video': return 'fa-video';
      case 'onsite': return 'fa-building';
      case 'technical': return 'fa-laptop-code';
      case 'behavioral': return 'fa-user-friends';
      default: return 'fa-calendar-check';
    }
  }
  
  getTypeLabel(type: string): string {
    switch (type) {
      case 'phone': return 'Phone';
      case 'video': return 'Video';
      case 'onsite': return 'On-site';
      case 'technical': return 'Technical';
      case 'behavioral': return 'Behavioral';
      default: return type;
    }
  }
  
  getStatusLabel(status: string): string {
    switch (status) {
      case 'scheduled': return 'Scheduled';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      case 'rescheduled': return 'Rescheduled';
      default: return status;
    }
  }
  
  getDaysUntil(date: Date): string {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const interviewDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const diffTime = interviewDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else if (diffDays > 1) {
      return `In ${diffDays} days`;
    } else {
      return `${Math.abs(diffDays)} days ago`;
    }
  }
}
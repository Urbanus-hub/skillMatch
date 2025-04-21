// messages.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Message {
  id: string;
  sender: {
    name: string;
    company?: string;
    avatar: string;
    isRecruiter?: boolean;
  };
  subject: string;
  preview: string;
  content: string;
  timestamp: Date;
  read: boolean;
  starred: boolean;
  attachments?: Attachment[];
  labels?: string[];
}

interface Attachment {
  name: string;
  type: string;
  size: string;
  url: string;
}

interface MessageFolder {
  id: string;
  name: string;
  icon: string;
  count: number;
  messages?: Message[];
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  imports:[CommonModule, FormsModule]
})
export class MessagesComponent implements OnInit {
  selectedFolderId: string = 'inbox';
  selectedMessageId: string | null = null;
  selectedMessage: Message | null = null;
  isComposing: boolean = false;
  searchQuery: string = '';
  
  folders: MessageFolder[] = [
    { id: 'inbox', name: 'Inbox', icon: 'fa-inbox', count: 8 },
    { id: 'starred', name: 'Starred', icon: 'fa-star', count: 3 },
    { id: 'sent', name: 'Sent', icon: 'fa-paper-plane', count: 12 },
    { id: 'drafts', name: 'Drafts', icon: 'fa-file', count: 2 },
    { id: 'archived', name: 'Archived', icon: 'fa-archive', count: 5 }
  ];
  
  messages: Message[] = [
    {
      id: 'm1',
      sender: {
        name: 'Sarah Johnson',
        company: 'TechCorp Inc.',
        avatar: '/api/placeholder/40/40',
        isRecruiter: true
      },
      subject: 'Your application for Senior Frontend Developer position',
      preview: 'Thank you for applying to the Senior Frontend Developer position at TechCorp. We were impressed by your...',
      content: `
        <p>Dear Candidate,</p>
        <p>Thank you for applying to the Senior Frontend Developer position at TechCorp Inc. We were impressed by your portfolio and experience with React and Angular.</p>
        <p>We would like to invite you for a first-round technical interview. Please let us know your availability for next week.</p>
        <p>Best regards,</p>
        <p>Sarah Johnson<br>Technical Recruiter<br>TechCorp Inc.</p>
      `,
      timestamp: new Date('2025-04-17T14:23:00'),
      read: false,
      starred: true,
      labels: ['Interview', 'Important']
    },
    {
      id: 'm2',
      sender: {
        name: 'Michael Chen',
        company: 'InnoSoft Solutions',
        avatar: '/api/placeholder/40/40',
        isRecruiter: true
      },
      subject: 'Follow-up on your React Developer Lead application',
      preview: 'I wanted to follow up on your application for the React Developer Lead position. Our team was impressed...',
      content: `
        <p>Hi there,</p>
        <p>I wanted to follow up on your application for the React Developer Lead position at InnoSoft Solutions. Our team was impressed with your experience and we'd like to arrange a technical interview.</p>
        <p>Could you please provide me with your availability for the upcoming week?</p>
        <p>Regards,</p>
        <p>Michael Chen<br>Senior HR Manager<br>InnoSoft Solutions</p>
      `,
      timestamp: new Date('2025-04-16T09:45:00'),
      read: true,
      starred: true,
      labels: ['Interview']
    },
    {
      id: 'm3',
      sender: {
        name: 'Career Development',
        company: 'JobFindr',
        avatar: '/api/placeholder/40/40'
      },
      subject: 'Weekly Job Market Insights',
      preview: 'Here are this week\'s top insights for frontend developers in your area. The demand for Angular skills has...',
      content: `
        <p>Hello,</p>
        <p>Here are this week's top insights for frontend developers in your area:</p>
        <ul>
          <li>The demand for Angular skills has increased by 15% in the last month</li>
          <li>Average salary offerings have risen by 5%</li>
          <li>Remote opportunities have increased by 20%</li>
        </ul>
        <p>We've also found 12 new job postings that match your profile. Check them out on your dashboard!</p>
        <p>JobFindr Team</p>
      `,
      timestamp: new Date('2025-04-15T16:30:00'),
      read: true,
      starred: false
    },
    {
      id: 'm4',
      sender: {
        name: 'David Lee',
        company: 'Google',
        avatar: '/api/placeholder/40/40',
        isRecruiter: true
      },
      subject: 'Next steps for your application',
      preview: 'Thank you for your patience during our interview process. I\'m pleased to inform you that you\'ve successfully...',
      content: `
        <p>Dear Applicant,</p>
        <p>Thank you for your patience during our interview process. I'm pleased to inform you that you've successfully passed the initial technical screening for the Senior Frontend Engineer position at Google.</p>
        <p>The next step in our process is an onsite interview with our team. Given the current circumstances, this will be conducted virtually via Google Meet.</p>
        <p>Please select your preferred time slots using the scheduling link below:</p>
        <p><a href="#">Schedule Interview</a></p>
        <p>Best regards,</p>
        <p>David Lee<br>Technical Recruiter<br>Google</p>
      `,
      timestamp: new Date('2025-04-14T11:15:00'),
      read: true,
      starred: true,
      labels: ['Interview', 'Urgent']
    },
    {
      id: 'm5',
      sender: {
        name: 'Alex Reynolds',
        company: 'Microsoft',
        avatar: '/api/placeholder/40/40',
        isRecruiter: true
      },
      subject: 'Your application for UI/UX Developer',
      preview: 'We have received your application for the UI/UX Developer position. Thank you for your interest in Microsoft...',
      content: `
        <p>Hello,</p>
        <p>We have received your application for the UI/UX Developer position. Thank you for your interest in Microsoft.</p>
        <p>Our team is currently reviewing applications and we will get back to you within the next 7-10 business days regarding next steps.</p>
        <p>In the meantime, please feel free to explore more about our team culture and benefits on our careers page.</p>
        <p>Best,</p>
        <p>Alex Reynolds<br>Talent Acquisition<br>Microsoft</p>
      `,
      timestamp: new Date('2025-04-12T15:45:00'),
      read: true,
      starred: false
    },
    {
      id: 'm6',
      sender: {
        name: 'Jennifer Williams',
        company: 'Amazon',
        avatar: '/api/placeholder/40/40'
      },
      subject: 'Invitation to Amazon Tech Connect Webinar',
      preview: 'You\'re invited to join our exclusive Tech Connect webinar for frontend developers. Learn about the latest...',
      content: `
        <p>Hi there,</p>
        <p>You're invited to join our exclusive Tech Connect webinar for frontend developers. Learn about the latest technologies we're using at Amazon and how we build scalable frontend architectures.</p>
        <p>Date: April 25, 2025<br>Time: 2:00 PM - 3:30 PM EST</p>
        <p>Register here: <a href="#">Register Now</a></p>
        <p>We hope to see you there!</p>
        <p>Jennifer Williams<br>Developer Relations<br>Amazon</p>
      `,
      timestamp: new Date('2025-04-10T09:30:00'),
      read: false,
      starred: false,
      labels: ['Webinar']
    },
    {
      id: 'm7',
      sender: {
        name: 'Mark Thompson',
        company: 'Facebook',
        avatar: '/api/placeholder/40/40',
        isRecruiter: true
      },
      subject: 'Feedback on your technical interview',
      preview: 'Thank you for taking the time to interview with us last week. The team was impressed with your technical...',
      content: `
        <p>Hello,</p>
        <p>Thank you for taking the time to interview with us last week. The team was impressed with your technical skills and problem-solving approach.</p>
        <p>We would like to invite you for the next round of interviews, where you'll have the opportunity to meet more team members and discuss potential projects in detail.</p>
        <p>Please let me know your availability for next week, and I'll coordinate with the team.</p>
        <p>Best regards,</p>
        <p>Mark Thompson<br>Technical Recruiter<br>Facebook</p>
      `,
      timestamp: new Date('2025-04-08T16:20:00'),
      read: true,
      starred: false,
      labels: ['Interview', 'Important'],
      attachments: [
        {
          name: 'Interview_Details.pdf',
          type: 'PDF',
          size: '420KB',
          url: '#'
        }
      ]
    },
    {
      id: 'm8',
      sender: {
        name: 'Skills Assessment Team',
        company: 'JobFindr',
        avatar: '/api/placeholder/40/40'
      },
      subject: 'Your JavaScript Assessment Results',
      preview: 'Congratulations! You\'ve completed the advanced JavaScript assessment with a score of 92%. This places you in...',
      content: `
        <p>Congratulations!</p>
        <p>You've completed the advanced JavaScript assessment with a score of 92%. This places you in the top 5% of developers who have taken this assessment.</p>
        <p>Your results have been added to your profile and will be visible to potential employers. Your strengths were particularly noted in:</p>
        <ul>
          <li>Functional programming concepts</li>
          <li>Asynchronous JavaScript</li>
          <li>Modern ES6+ features</li>
        </ul>
        <p>We recommend focusing on improving your skills in:</p>
        <ul>
          <li>Design patterns</li>
          <li>Performance optimization</li>
        </ul>
        <p>Check out our recommended courses to enhance these skills.</p>
        <p>JobFindr Skills Team</p>
      `,
      timestamp: new Date('2025-04-05T14:10:00'),
      read: true,
      starred: false,
      attachments: [
        {
          name: 'Assessment_Certificate.pdf',
          type: 'PDF',
          size: '215KB',
          url: '#'
        },
        {
          name: 'Detailed_Results.pdf',
          type: 'PDF',
          size: '350KB',
          url: '#'
        }
      ]
    }
  ];
  
  currentFolderMessages: Message[] = [];
  
  constructor() { }
  
  ngOnInit(): void {
    this.loadFolderMessages(this.selectedFolderId);
    // Set first message as selected by default
    if (this.currentFolderMessages.length > 0) {
      this.viewMessage(this.currentFolderMessages[0].id);
    }
  }
  
  loadFolderMessages(folderId: string): void {
    // In a real app, this would make an API call
    switch(folderId) {
      case 'inbox':
        this.currentFolderMessages = this.messages.filter(m => !m.read || m.id === 'm1' || m.id === 'm6');
        break;
      case 'starred':
        this.currentFolderMessages = this.messages.filter(m => m.starred);
        break;
      case 'sent':
        // Demo sent messages
        this.currentFolderMessages = [
          {
            id: 's1',
            sender: {
              name: 'You',
              avatar: '/api/placeholder/40/40'
            },
            subject: 'RE: Your application for Senior Frontend Developer position',
            preview: 'Thank you for reaching out. I am available for an interview on Monday or Tuesday next week...',
            content: `
              <p>Dear Sarah,</p>
              <p>Thank you for reaching out. I am excited about the opportunity to interview for the Senior Frontend Developer position at TechCorp Inc.</p>
              <p>I am available for an interview on Monday or Tuesday next week between 10 AM and 4 PM EST. Please let me know what time works best for your team.</p>
              <p>I look forward to discussing my experience and learning more about the role.</p>
              <p>Best regards,</p>
            `,
            timestamp: new Date('2025-04-17T15:45:00'),
            read: true,
            starred: false
          },
          {
            id: 's2',
            sender: {
              name: 'You',
              avatar: '/api/placeholder/40/40'
            },
            subject: 'RE: Follow-up on your React Developer Lead application',
            preview: 'Thank you for your interest in my application. I would be available for an interview on...',
            content: `
              <p>Hi Michael,</p>
              <p>Thank you for your interest in my application. I would be available for an interview on Wednesday or Thursday next week, preferably in the morning hours before noon EST.</p>
              <p>I'm looking forward to discussing how my experience with React and leading development teams aligns with what InnoSoft Solutions is looking for.</p>
              <p>Best regards,</p>
            `,
            timestamp: new Date('2025-04-16T10:20:00'),
            read: true,
            starred: false
          }
        ];
        break;
      case 'drafts':
        // Demo draft messages
        this.currentFolderMessages = [
          {
            id: 'd1',
            sender: {
              name: 'You',
              avatar: '/api/placeholder/40/40'
            },
            subject: 'Question about the Frontend Architect position',
            preview: 'I noticed your job posting for a Frontend Architect and had a few questions about the...',
            content: `
              <p>Hello,</p>
              <p>I noticed your job posting for a Frontend Architect and had a few questions about the role:</p>
              <p>1. Could you provide more details about the team structure?</p>
              <p>2. What technologies are currently being used in your frontend stack?</p>
              <p>3. Are there opportunities for remote work?</p>
              <p>[Draft - add more questions]</p>
            `,
            timestamp: new Date('2025-04-14T09:15:00'),
            read: true,
            starred: false
          },
          {
            id: 'd2',
            sender: {
              name: 'You',
              avatar: '/api/placeholder/40/40'
            },
            subject: 'Follow up on interview',
            preview: 'Thank you for the opportunity to interview for the...',
            content: `
              <p>Dear Hiring Manager,</p>
              <p>Thank you for the opportunity to interview for the [Position] at [Company]. I enjoyed our conversation about [Topic] and was particularly interested in [Specific project/detail discussed].</p>
              <p>[Draft - add more content]</p>
            `,
            timestamp: new Date('2025-04-13T16:50:00'),
            read: true,
            starred: false
          }
        ];
        break;
      case 'archived':
        // Demo archived messages
        this.currentFolderMessages = [
          {
            id: 'a1',
            sender: {
              name: 'JobFindr Alerts',
              company: 'JobFindr',
              avatar: '/api/placeholder/40/40'
            },
            subject: 'New jobs matching your profile',
            preview: 'We found 5 new jobs that match your skills and preferences. Check them out now!',
            content: `
              <p>Hello,</p>
              <p>We found 5 new jobs that match your skills and preferences. Check them out now!</p>
              <ul>
                <li>Frontend Developer at StartupX</li>
                <li>UI/UX Developer at DesignCo</li>
                <li>Angular Specialist at TechGiant</li>
                <li>Frontend Engineer at FinTech Inc.</li>
                <li>Web Developer at CreativeAgency</li>
              </ul>
              <p>Click here to view full details: <a href="#">View Jobs</a></p>
              <p>JobFindr Team</p>
            `,
            timestamp: new Date('2025-03-28T10:30:00'),
            read: true,
            starred: false
          }
        ];
        break;
      default:
        this.currentFolderMessages = [];
    }
    
    // Reset selected message when changing folders
    this.selectedMessageId = null;
    this.selectedMessage = null;
  }
  
  viewMessage(messageId: string): void {
    this.selectedMessageId = messageId;
    
    // Find the message in the current folder
    const message = this.currentFolderMessages.find(m => m.id === messageId);
    
    if (message) {
      this.selectedMessage = message;
      
      // Mark as read if not already
      if (!message.read) {
        message.read = true;
        
        // Update counter in folders
        if (this.selectedFolderId === 'inbox') {
          const inbox = this.folders.find(f => f.id === 'inbox');
          if (inbox && inbox.count > 0) {
            inbox.count--;
          }
        }
      }
    }
  }
  
  toggleStar(message: Message, event: Event): void {
    event.stopPropagation();
    message.starred = !message.starred;
    
    // Update counters in folders
    if (message.starred) {
      const starred = this.folders.find(f => f.id === 'starred');
      if (starred) {
        starred.count++;
      }
    } else {
      const starred = this.folders.find(f => f.id === 'starred');
      if (starred && starred.count > 0) {
        starred.count--;
      }
    }
  }
  
  archiveMessage(messageId: string): void {
    // Find the message in the current list
    const index = this.currentFolderMessages.findIndex(m => m.id === messageId);
    
    if (index !== -1) {
      // Remove from current folder
      this.currentFolderMessages.splice(index, 1);
      
      // If no messages left, select nothing
      if (this.currentFolderMessages.length === 0) {
        this.selectedMessageId = null;
        this.selectedMessage = null;
      } 
      // Otherwise select the next message, or the previous if it was the last one
      else {
        const nextIndex = index < this.currentFolderMessages.length ? index : index - 1;
        this.viewMessage(this.currentFolderMessages[nextIndex].id);
      }
      
      // Update archive counter
      const archive = this.folders.find(f => f.id === 'archived');
      if (archive) {
        archive.count++;
      }
      
      // Update current folder counter if applicable
      const currentFolder = this.folders.find(f => f.id === this.selectedFolderId);
      if (currentFolder && currentFolder.count > 0) {
        currentFolder.count--;
      }
    }
  }
  
  openComposeModal(): void {
    this.isComposing = true;
  }
  
  closeComposeModal(): void {
    this.isComposing = false;
  }
  
  formatMessageDate(date: Date): string {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today - show time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      // Within a week - show day name
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      // More than a week - show date
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }
  
  getInitials(name: string): string {
    return name.split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }
}
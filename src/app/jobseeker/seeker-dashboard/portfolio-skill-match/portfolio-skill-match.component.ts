// skillmatch-portfolio.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';


interface Project {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  gallery: string[];
  technologies: string[];
  category: string[];
  date: string;
  views: number;
  likes: number;
  githubUrl: string;
  liveUrl?: string;
  goals: string[];
  features: string[];
  role: string;
}

@Component({
  selector: 'app-skillmatch-portfolio',
  templateUrl: './portfolio-skill-match.component.html',
  styleUrls: ['./portfolio-skill-match.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class SkillmatchPortfolioComponent implements OnInit {
  activeSection: string = 'portfolio';
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  selectedProject: Project | null = null;
  activeFilter: string = 'all';
  currentMainImage: string = '';

  constructor() { }

  ngOnInit() {
    // Initialize projects data
    this.projects = [
      {
        id: 1,
        title: 'E-commerce Platform',
        description: 'Full-stack React application with Node.js backend for a modern e-commerce platform with advanced filtering and payment integration.',
        fullDescription: 'This comprehensive e-commerce platform offers a seamless shopping experience with advanced product filtering, real-time inventory management, secure payment processing, and a responsive design that works flawlessly across all devices. The admin dashboard provides detailed analytics and easy product management capabilities.',
        image: 'assets/images/projects/ecommerce.jpg',
        gallery: [
          'assets/images/projects/ecommerce-1.jpg',
          'assets/images/projects/ecommerce-2.jpg',
          'assets/images/projects/ecommerce-3.jpg',
          'assets/images/projects/ecommerce-4.jpg',
        ],
        technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Redux', 'Stripe API'],
        category: ['web', 'frontend', 'backend'],
        date: 'Jan 2023',
        views: 1245,
        likes: 87,
        githubUrl: 'https://github.com/username/ecommerce-project',
        liveUrl: 'https://ecommerce-project.netlify.app',
        goals: [
          'Create a modern shopping experience with intuitive navigation',
          'Implement secure payment processing with multiple options',
          'Build a responsive design that works on all devices',
          'Develop comprehensive admin tools for inventory management',
          'Optimize performance for fast page loads and interactions'
        ],
        features: [
          'Advanced product filtering and search functionality',
          'User authentication and profile management',
          'Secure payment processing with Stripe integration',
          'Order tracking and history',
          'Responsive design with mobile-first approach',
          'Admin dashboard with sales analytics and inventory management'
        ],
        role: 'As the lead developer, I was responsible for the entire frontend architecture, state management with Redux, and integration with the backend APIs. I also implemented the responsive design and optimized the performance for a seamless user experience.'
      },
      {
        id: 2,
        title: 'AI Chat Interface',
        description: 'Real-time chat application with AI integration, built with Python and TensorFlow for natural language processing.',
        fullDescription: 'This AI-powered chat interface uses advanced natural language processing to provide intelligent responses to user queries. The application features real-time message delivery, conversation history, and context-aware AI that remembers previous interactions for more meaningful conversations.',
        image: 'assets/images/projects/ai-chat.jpg',
        gallery: [
          'assets/images/projects/ai-chat-1.jpg',
          'assets/images/projects/ai-chat-2.jpg',
          'assets/images/projects/ai-chat-3.jpg',
        ],
        technologies: ['Python', 'TensorFlow', 'WebSocket', 'React'],
        category: ['web', 'ai', 'backend'],
        date: 'Mar 2023',
        views: 876,
        likes: 65,
        githubUrl: 'https://github.com/username/ai-chat',
        liveUrl: 'https://ai-chat-demo.vercel.app',
        goals: [
          'Build a responsive chat interface with real-time capabilities',
          'Integrate natural language processing for intelligent responses',
          'Create a system that learns from interactions to improve over time',
          'Ensure data privacy and security for all conversations',
          'Design an intuitive user experience with minimal learning curve'
        ],
        features: [
          'Real-time messaging with WebSocket technology',
          'Natural language processing powered by TensorFlow',
          'Context-aware AI that remembers conversation history',
          'End-to-end encryption for secure communications',
          'Multi-platform support (web, mobile, desktop)',
          'Voice input and text-to-speech output options'
        ],
        role: 'I developed the AI integration and machine learning models, implemented the WebSocket server for real-time communication, and collaborated with a UX designer to create an intuitive and engaging interface.'
      },
      {
        id: 3,
        title: 'Analytics Dashboard',
        description: 'Data visualization platform for enterprise metrics with real-time updates and customizable reports.',
        fullDescription: 'This comprehensive analytics dashboard provides businesses with powerful insights through interactive visualizations, real-time data updates, and customizable reporting features. It integrates with multiple data sources to deliver a complete view of key performance indicators across the organization.',
        image: 'assets/images/projects/analytics.jpg',
        gallery: [
          'assets/images/projects/analytics-1.jpg',
          'assets/images/projects/analytics-2.jpg',
          'assets/images/projects/analytics-3.jpg',
          'assets/images/projects/analytics-4.jpg',
        ],
        technologies: ['Vue.js', 'D3.js', 'GraphQL', 'Firebase'],
        category: ['web', 'data', 'frontend'],
        date: 'May 2023',
        views: 942,
        likes: 76,
        githubUrl: 'https://github.com/username/analytics-dashboard',
        goals: [
          'Design an intuitive dashboard for visualizing complex data',
          'Implement real-time data updates with optimized performance',
          'Create customizable reports for different business needs',
          'Support integration with multiple data sources',
          'Ensure accessibility and usability across different teams'
        ],
        features: [
          'Interactive data visualizations with D3.js',
          'Real-time data updates through GraphQL subscriptions',
          'Customizable dashboards with drag-and-drop interface',
          'Export capabilities for reports in multiple formats',
          'Role-based access control for different user levels',
          'Data source connectors for various business systems'
        ],
        role: 'I was responsible for designing the data visualization architecture, implementing the D3.js charts and graphs, and creating the real-time data pipeline with GraphQL. I also led the UX research to ensure the dashboard was intuitive for business users.'
      },
      {
        id: 4,
        title: 'Fitness Tracking App',
        description: 'Mobile application for fitness tracking with personalized workout plans and progress analytics.',
        fullDescription: 'This comprehensive fitness tracking application helps users achieve their health goals through personalized workout plans, detailed progress tracking, and insightful analytics. The app includes features like workout timers, achievement badges, and social sharing to keep users motivated.',
        image: 'assets/images/projects/fitness-app.jpg',
        gallery: [
          'assets/images/projects/fitness-app-1.jpg',
          'assets/images/projects/fitness-app-2.jpg',
          'assets/images/projects/fitness-app-3.jpg',
        ],
        technologies: ['React Native', 'Firebase', 'Redux', 'Node.js'],
        category: ['mobile', 'frontend', 'backend'],
        date: 'Jul 2023',
        views: 764,
        likes: 52,
        githubUrl: 'https://github.com/username/fitness-tracker',
        liveUrl: 'https://play.google.com/store/apps/details?id=com.fitnessapp',
        goals: [
          'Create a user-friendly mobile app for fitness tracking',
          'Implement personalized workout recommendations',
          'Develop detailed analytics for tracking progress',
          'Design an engaging UI/UX to encourage regular use',
          'Build a community feature for motivation and sharing'
        ],
        features: [
          'Personalized workout plans based on user goals',
          'Progress tracking with visual charts and metrics',
          'Achievement system with badges and rewards',
          'Workout timer with audio cues',
          'Social sharing and community challenges',
          'Integration with wearable devices'
        ],
        role: 'I led the development of this React Native application, implementing the UI components, state management with Redux, and backend integration. I also designed the data schema and implemented the analytics features.'
      },
      {
        id: 5,
        title: 'Smart Home Control System',
        description: 'IoT solution for smart home management with voice control and energy optimization features.',
        fullDescription: 'This innovative smart home control system connects various IoT devices to provide a seamless home automation experience. The system includes voice control capabilities, energy usage optimization, and customizable routines for different scenarios like "morning," "away," and "bedtime."',
        image: 'assets/images/projects/smart-home.jpg',
        gallery: [
          'assets/images/projects/smart-home-1.jpg',
          'assets/images/projects/smart-home-2.jpg',
          'assets/images/projects/smart-home-3.jpg',
        ],
        technologies: ['IoT', 'React', 'Node.js', 'MQTT', 'TensorFlow Lite'],
        category: ['iot', 'frontend', 'ai'],
        date: 'Sep 2023',
        views: 635,
        likes: 48,
        githubUrl: 'https://github.com/username/smart-home',
        goals: [
          'Develop a centralized system for controlling various smart home devices',
          'Implement voice control features for hands-free operation',
          'Create energy optimization algorithms to reduce consumption',
          'Design an intuitive interface for users of all ages',
          'Ensure security and privacy for all connected devices'
        ],
        features: [
          'Central dashboard for controlling all connected devices',
          'Voice control integration with multiple platforms',
          'Energy usage monitoring and optimization recommendations',
          'Customizable routines for different scenarios',
          'Security features including presence simulation',
          'Mobile app for remote control and monitoring'
        ],
        role: 'I developed the core control system architecture, implemented the MQTT communication protocol for device control, and designed the energy optimization algorithms. I also created the voice control integration with TensorFlow Lite.'
      },
      {
        id: 6,
        title: 'Financial Portfolio Manager',
        description: 'Web application for tracking and managing investment portfolios with real-time market data.',
        fullDescription: 'This comprehensive financial portfolio manager helps investors track and optimize their investments with real-time market data, performance analytics, and portfolio diversification recommendations. The application provides detailed insights into asset allocation, risk assessment, and potential tax implications.',
        image: 'assets/images/projects/finance-app.jpg',
        gallery: [
          'assets/images/projects/finance-app-1.jpg',
          'assets/images/projects/finance-app-2.jpg',
          'assets/images/projects/finance-app-3.jpg',
          'assets/images/projects/finance-app-4.jpg',
        ],
        technologies: ['Angular', 'TypeScript', 'D3.js', 'Node.js', 'MongoDB'],
        category: ['web', 'finance', 'data'],
        date: 'Nov 2023',
        views: 582,
        likes: 39,
        githubUrl: 'https://github.com/username/finance-portfolio',
        liveUrl: 'https://finance-portfolio-manager.com',
        goals: [
          'Create a secure platform for tracking investment portfolios',
          'Implement real-time market data integration',
          'Develop detailed analytics for performance tracking',
          'Design tools for portfolio optimization and rebalancing',
          'Ensure high-level security for sensitive financial data'
        ],
        features: [
          'Portfolio tracking with real-time market updates',
          'Performance analytics with visual charts and comparisons',
          'Asset allocation analysis and recommendations',
          'Tax impact estimations for trading decisions',
          'Scenario planning tools for future market conditions',
          'Secure authentication and data encryption'
        ],
        role: 'I designed and implemented the entire frontend architecture using Angular and TypeScript, created the data visualization components with D3.js, and developed the portfolio optimization algorithms. I also implemented the security features and real-time data integration.'
      }
    ];
    
    this.filteredProjects = [...this.projects];
  }

  /**
   * Filter projects by category
   * @param filter - The category to filter by
   */
  filterProjects(filter: string): void {
    this.activeFilter = filter;
    
    if (filter === 'all') {
      this.filteredProjects = [...this.projects];
    } else {
      this.filteredProjects = this.projects.filter(project => 
        project.category.includes(filter)
      );
    }
  }

  /**
   * Get all unique categories from projects
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    categories.add('all');
    
    this.projects.forEach(project => {
      project.category.forEach(cat => categories.add(cat));
    });
    
    return Array.from(categories);
  }

  /**
   * Open project details modal
   * @param project - The project to view
   */
  viewProject(project: Project): void {
    this.selectedProject = project;
    if (project.gallery && project.gallery.length > 0) {
      this.currentMainImage = project.image;
    }
  }

  /**
   * Close project details modal
   */
  closeProjectModal(): void {
    this.selectedProject = null;
  }

  /**
   * Set the main image in the project modal
   * @param imageUrl - The URL of the image to set as main
   */
  setMainImage(imageUrl: string): void {
    this.currentMainImage = imageUrl;
  }

  /**
   * Increment the like count for a project
   * @param project - The project to like
   * @param event - The click event
   */
  likeProject(project: Project, event: Event): void {
    event.stopPropagation(); // Prevent triggering viewProject
    project.likes++;
  }

  /**
   * Sort projects by date, newest first
   */
  sortByNewest(): void {
    this.filteredProjects.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  }

  /**
   * Sort projects by date, oldest first
   */
  sortByOldest(): void {
    this.filteredProjects.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    });
  }

  /**
   * Sort projects by views
   */
  sortByViews(): void {
    this.filteredProjects.sort((a, b) => b.views - a.views);
  }

  /**
   * Sort projects by likes
   */
  sortByLikes(): void {
    this.filteredProjects.sort((a, b) => b.likes - a.likes);
  }

  /**
   * Handle sort selection changes
   * @param event - The selection change event
   */
  handleSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    
    switch (value) {
      case 'Newest First':
        this.sortByNewest();
        break;
      case 'Oldest First':
        this.sortByOldest();
        break;
      case 'Most Viewed':
        this.sortByViews();
        break;
      case 'Most Liked':
        this.sortByLikes();
        break;
      default:
        this.sortByNewest();
    }
  }

  /**
   * Navigate to a different section of the portfolio
   * @param section - The section to navigate to
   */
  navigateTo(section: string): void {
    this.activeSection = section;
  }

  /**
   * Search projects by title or description
   * @param searchTerm - The term to search for
   */
  searchProjects(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filterProjects(this.activeFilter);
      return;
    }
    
    const term = searchTerm.toLowerCase().trim();
    const filtered = this.projects.filter(project => 
      project.title.toLowerCase().includes(term) || 
      project.description.toLowerCase().includes(term) ||
      project.technologies.some(tech => tech.toLowerCase().includes(term))
    );
    
    this.filteredProjects = filtered;
  }

  /**
   * Get similar projects based on technologies and categories
   * @param project - The reference project
   * @returns Array of similar projects
   */
  getSimilarProjects(project: Project): Project[] {
    if (!project) return [];
    
    return this.projects
      .filter(p => p.id !== project.id)
      .map(p => {
        // Calculate similarity score based on matching technologies and categories
        const techOverlap = p.technologies.filter(tech => 
          project.technologies.includes(tech)
        ).length;
        
        const categoryOverlap = p.category.filter(cat => 
          project.category.includes(cat)
        ).length;
        
        const score = techOverlap * 2 + categoryOverlap * 3; // Weighted score
        return { project: p, score };
      })
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .slice(0, 3) // Take top 3
      .map(item => item.project); // Return just the projects
  }
}
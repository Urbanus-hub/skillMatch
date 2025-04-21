// skill-path.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SkillNode {
  id: number;
  name: string;
  level: string;
  description: string;
  progress: number;
  completed: boolean;
  children: SkillChild[];
}

interface SkillChild {
  name: string;
  mastery: number;
}

@Component({
  selector: 'app-skill-path',
  templateUrl: './skill-path.component.html',
  styleUrls: ['./skill-path.component.css'],
  imports:[CommonModule]
})
export class SkillPathComponent implements OnInit {
  activeTabIndex: number = 0;
  expandedNodeId: number | null = null;
  
  tabs: string[] = ["Frontend", "Backend", "DevOps", "Data Science"];
  
  skillPaths: { [key: string]: SkillNode[] } = {
    Frontend: [
      {
        id: 1,
        name: "HTML/CSS",
        level: "Beginner",
        description: "Foundation of web development",
        progress: 95,
        completed: true,
        children: [
          { name: "Semantic HTML5", mastery: 90 },
          { name: "CSS3 Layouts", mastery: 85 },
          { name: "Responsive Design", mastery: 95 }
        ]
      },
      {
        id: 2,
        name: "JavaScript",
        level: "Intermediate",
        description: "Core programming language for web",
        progress: 80,
        completed: true,
        children: [
          { name: "ES6+ Features", mastery: 85 },
          { name: "DOM Manipulation", mastery: 90 },
          { name: "Async Programming", mastery: 75 }
        ]
      },
      {
        id: 3,
        name: "Angular",
        level: "Intermediate",
        description: "Modern frontend framework",
        progress: 65,
        completed: false,
        children: [
          { name: "Components", mastery: 70 },
          { name: "Services", mastery: 65 },
          { name: "RxJS", mastery: 60 },
          { name: "NgRx", mastery: 40 }
        ]
      },
      {
        id: 4,
        name: "Advanced UI",
        level: "Advanced",
        description: "Advanced UI techniques & patterns",
        progress: 30,
        completed: false,
        children: [
          { name: "Animations", mastery: 35 },
          { name: "Microfrontends", mastery: 25 },
          { name: "Accessibility", mastery: 40 }
        ]
      }
    ],
    Backend: [
      {
        id: 5,
        name: "Node.js",
        level: "Beginner",
        description: "JavaScript runtime for backend",
        progress: 60,
        completed: false,
        children: [
          { name: "Express", mastery: 65 },
          { name: "RESTful APIs", mastery: 70 },
          { name: "Authentication", mastery: 55 }
        ]
      },
      {
        id: 6,
        name: "Databases",
        level: "Intermediate",
        description: "Data storage and management",
        progress: 45,
        completed: false,
        children: [
          { name: "SQL", mastery: 50 },
          { name: "NoSQL", mastery: 40 },
          { name: "ORM/ODM", mastery: 35 }
        ]
      }
    ],
    DevOps: [
      {
        id: 7,
        name: "Git",
        level: "Beginner",
        description: "Version control system",
        progress: 75,
        completed: false,
        children: [
          { name: "Branching Strategies", mastery: 70 },
          { name: "CI/CD Pipelines", mastery: 65 }
        ]
      },
      {
        id: 8,
        name: "Docker",
        level: "Intermediate",
        description: "Containerization technology",
        progress: 30,
        completed: false,
        children: [
          { name: "Container Basics", mastery: 35 },
          { name: "Docker Compose", mastery: 25 }
        ]
      }
    ],
    "Data Science": [
      {
        id: 9,
        name: "Python",
        level: "Beginner",
        description: "Programming language for data analysis",
        progress: 20,
        completed: false,
        children: [
          { name: "Pandas", mastery: 15 },
          { name: "NumPy", mastery: 25 }
        ]
      },
      {
        id: 10,
        name: "Data Visualization",
        level: "Intermediate",
        description: "Creating visual representations of data",
        progress: 10,
        completed: false,
        children: [
          { name: "Matplotlib", mastery: 10 },
          { name: "D3.js", mastery: 15 }
        ]
      }
    ]
  };

  currentSkillPath: SkillNode[] = [];
  recommendedSkills: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.currentSkillPath = this.skillPaths[this.tabs[this.activeTabIndex]];
    this.generateRecommendations();
  }

  switchTab(index: number): void {
    this.activeTabIndex = index;
    this.currentSkillPath = this.skillPaths[this.tabs[index]];
    this.expandedNodeId = null;
    this.generateRecommendations();
  }

  toggleNode(nodeId: number): void {
    this.expandedNodeId = this.expandedNodeId === nodeId ? null : nodeId;
  }

  getProgressClass(progress: number): string {
    if (progress >= 80) return 'high';
    if (progress >= 40) return 'medium';
    return 'low';
  }

  generateRecommendations(): void {
    // Identify skills with low progress in the current path
    const lowProgressSkills = this.currentSkillPath
      .filter(skill => skill.progress < 70 && !skill.completed)
      .map(skill => {
        // Find the lowest mastery child skill
        const lowestChild = [...skill.children].sort((a, b) => a.mastery - b.mastery)[0];
        return {
          parentName: skill.name,
          skillName: lowestChild.name,
          priority: (70 - skill.progress) * 10,
          jobGrowth: Math.floor(Math.random() * 20) + 10
        };
      });
      
    this.recommendedSkills = lowProgressSkills.sort((a, b) => b.priority - a.priority).slice(0, 3);
  }
}
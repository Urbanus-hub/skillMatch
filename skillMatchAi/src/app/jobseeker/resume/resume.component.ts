// resume.component.ts
import { Component, OnInit } from '@angular/core';
import { Pipe } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';



@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css'],
 imports: [CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class ResumeComponent implements OnInit {
  isDragging = false;
  fileName: string | null = null;
  fileSize: number | null = null;
  maxFileSize = 3; // 3MB max file size

  constructor() { }

  ngOnInit(): void { }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    
    if (event.dataTransfer && event.dataTransfer.files.length) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File) {
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > this.maxFileSize) {
      alert(`File size exceeds ${this.maxFileSize}MB limit`);
      return;
    }

    this.fileName = file.name;
    this.fileSize = fileSizeMB;
    
    // Here you would typically upload the file to your server
    console.log('File ready for upload:', file);
  }

  removeFile() {
    this.fileName = null;
    this.fileSize = null;
  }

  goBack() {
    // Navigation logic to go back
    console.log('Going back to previous step');
  }

  finish() {
    // Navigation logic to finish
    console.log('Completing the process with resume:', this.fileName);
  }
}
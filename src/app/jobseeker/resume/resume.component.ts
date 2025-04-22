// src/app/jobseeker/resume/resume.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router'; // Added Router
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpClientModule } from '@angular/common/http'; // Added HttpClient related imports
import { finalize, catchError, tap, throwError } from 'rxjs'; // Added RxJS operators

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, HttpClientModule] // Added HttpClientModule
})
export class ResumeComponent implements OnInit {

  // --- State Properties ---
  isDragging: boolean = false;
  fileName: string | null = null;
  fileSize: string | null = null;
  selectedFile: File | null = null; // Store the actual File object
  isLoading: boolean = false;
  errorMessage: string | null = null;

  // --- Injected Services ---
  private http = inject(HttpClient);
  private router = inject(Router);

  // --- API Configuration ---
  private apiUrl = 'http://localhost:5000/api'; // Replace with your actual API base URL

  constructor() { }

  ngOnInit(): void {
    // Optional: Load existing resume info if needed
  }

  // --- Drag and Drop Handlers ---
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  // --- File Selection Handler ---
  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  // --- File Processing ---
  handleFile(file: File): void {
    // Basic validation (add more as needed, e.g., file type)
    const maxSizeMB = 3;
    if (file.size > maxSizeMB * 1024 * 1024) {
      this.errorMessage = `File is too large. Maximum size is ${maxSizeMB}MB.`;
      this.removeFile(); // Clear selection
      return;
    }

    this.selectedFile = file;
    this.fileName = file.name;
    this.fileSize = (file.size / 1024 / 1024).toFixed(2); // Size in MB
    this.errorMessage = null; // Clear previous errors
  }

  removeFile(): void {
    this.selectedFile = null;
    this.fileName = null;
    this.fileSize = null;
    this.errorMessage = null;
    // If using a file input, reset it if necessary
    // const fileInput = document.getElementById('fileInputId') as HTMLInputElement;
    // if (fileInput) fileInput.value = '';
  }

  // --- Navigation ---
  goBack(): void {
    // Navigate back to the skills step
    this.router.navigate(['/skills']); // Adjust path if needed
  }

  // --- Upload and Finish ---
  finish(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a resume file to upload.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // Create FormData to send the file
    const formData = new FormData();
    // *** IMPORTANT: Use the field name expected by your backend multer setup ***
    // Based on user.routes.ts, it expects 'resumeFile'
    formData.append('resumeFile', this.selectedFile, this.selectedFile.name);

    const uploadUrl = `${this.apiUrl}/users/resumes`; // Your backend endpoint
    console.log(`Uploading resume to: ${uploadUrl}`);

    // Get auth token
    const token = localStorage.getItem('authToken'); // Use consistent key
    if (!token) {
        this.errorMessage = 'Authentication error. Please log in again.';
        this.isLoading = false;
        this.router.navigate(['/auth/login']); // Redirect to login
        return;
    }

    // Create headers *without* Content-Type; browser sets it for FormData
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
      // DO NOT set 'Content-Type': 'multipart/form-data' manually
    });

    // Send the POST request
    this.http.post<any>(uploadUrl, formData, { headers: headers })
      .pipe(
        tap(response => {
          console.log('Resume uploaded successfully:', response);
          // Navigate to the dashboard AFTER successful upload
          this.router.navigate(['/seekerDashboard']);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error uploading resume:', error);
          this.errorMessage = error.error?.error || error.error?.message || 'Failed to upload resume. Please try again.';
          // Handle specific errors if needed (e.g., 401 Unauthorized)
          if (error.status === 401 || error.status === 403) {
              this.errorMessage = 'Authentication failed. Please log in again.';
              this.router.navigate(['/auth/login']);
          }
          return throwError(() => new Error(this.errorMessage || 'An unknown error occurred.')); // Re-throw error
        }),
        finalize(() => {
          this.isLoading = false; // Ensure loading state is turned off
        })
      )
      .subscribe(); // Subscribe to trigger the request
  }
}

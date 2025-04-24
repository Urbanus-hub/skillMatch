// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// export interface Candidate {
//   id: number;
//   name: string;
//   title: string;
//   yearsOfExperience: number;
//   employer: string;
//   occupation: string;
//   location: string;
//   education: string;
//   skills: string[];
//   projectCount: number;
//   rating: number;
//   availability: string;
//   avatar: string;
//   category: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class TalentService {
//   private apiUrl = '/candidates'; // Adjust to actual backend endpoint

//   constructor(private http: HttpClient) {}

//   getCandidates(): Observable<Candidate[]> {
//     return this.http.get<Candidate[]>(this.apiUrl);
//   }
// }

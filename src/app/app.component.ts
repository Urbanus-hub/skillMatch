import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
// import {HomeComponent} from "./home/home.component";



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
//   title = 'skillMatchAi';
//   message="I am Frontend";
// constructor(private http:HttpClient){}
// onInit(){
//   this.http.get('http://localhost:3000/api/hello').subscribe(
//     (response) => {
//       console.log('API Response:', response);
//     },
//     (error) => {
//       console.error('API Error:', error);
//     }
//   );
// }

}

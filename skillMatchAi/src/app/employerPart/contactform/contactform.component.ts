// contact-form.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-contact-form',
  templateUrl: './contactform.component.html',
  styleUrls: ['./contactform.component.css'],
  imports: [ReactiveFormsModule],
  standalone: true
})
export class ContactFormComponent {
  contactForm: FormGroup;
  selectedOption: string = 'contacts';

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      location: ['', Validators.required],
      telephone: ['', Validators.required]
    });
  }

  onOptionSelect(option: string): void {
    this.selectedOption = option;
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log('Form submitted:', this.contactForm.value);
      // Add your submit logic here
    }
  }
}
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  descriptionItems: string[] = [
    'View and add students',
    'Create and manage courses',
    'Track and manage student attendance',
    'Calculate final grades based on exams and assignments'
  ];
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Assignment } from '../../../models/assignment.model';

@Component({
  selector: 'app-assignments-list',
  templateUrl: './assignments-list.component.html',
  styleUrl: './assignments-list.component.scss',
})
export class AssignmentsListComponent {
  @Input() assignments: Assignment[] = [];
  @Output() editAssignment: EventEmitter<Assignment> =
    new EventEmitter<Assignment>();

  onEditAssignment(assignment: Assignment) {
    this.editAssignment.emit(assignment);
  }

  updateGrades(id: string) {}
}

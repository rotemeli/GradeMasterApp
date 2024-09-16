import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Assignment } from '../../../models/assignment.model';

@Component({
  selector: 'app-assignments-list',
  templateUrl: './assignments-list.component.html',
  styleUrl: './assignments-list.component.scss',
})
export class AssignmentsListComponent {
  @Input() assignments: Assignment[] = [];
  @Input() isDeleting: { [key: string]: boolean } = {};
  @Output() editAssignment: EventEmitter<Assignment> =
    new EventEmitter<Assignment>();
  @Output() deleteAssignment: EventEmitter<string> = new EventEmitter<string>();

  onEditAssignment(assignment: Assignment) {
    this.editAssignment.emit(assignment);
  }

  onDeleteAssignment(assignmentId: string) {
    this.deleteAssignment.emit(assignmentId);
  }

  updateGrades(id: string) {}
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Exam } from '../../../models/exam.model';

@Component({
  selector: 'app-exam-card',
  templateUrl: './exam-card.component.html',
  styleUrl: './exam-card.component.scss',
})
export class ExamCardComponent {
  @Input() exam: Exam | null = null;
  @Input() isDeleting: { [key: string]: boolean } = {};
  @Output() editExam: EventEmitter<Exam> = new EventEmitter<Exam>();
  @Output() deleteExam: EventEmitter<string> = new EventEmitter<string>();
  @Output() updateGrades: EventEmitter<string> = new EventEmitter<string>();

  onEditExam(exam: Exam | null) {
    if (!exam) return;
    this.editExam.emit(exam);
  }

  onDeleteExam(examId: string | undefined) {
    if (!examId) return;
    this.deleteExam.emit(examId);
  }

  onUpdateExam(examId: string | undefined) {
    if (!examId) return;
    this.updateGrades.emit(examId);
  }
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CoursesComponent } from './components/courses/courses/courses.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { authGuard } from './guards/auth.guard';
import { authReverseGuard } from './guards/auth-reverse.guard';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { CourseDetailsComponent } from './components/courses/course-details/course-details.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { UpdateGradesComponent } from './components/tasks/update-grades/update-grades.component';
import { FinalGradesComponent } from './components/final-grades/final-grades.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [authReverseGuard],
    pathMatch: 'full',
  },
  {
    path: 'registration',
    component: RegistrationComponent,
    canActivate: [authReverseGuard],
  },
  {
    path: '',
    canActivateChild: [authGuard],
    children: [
      { path: 'courses', component: CoursesComponent },
      { path: 'courses/:id/details', component: CourseDetailsComponent },
      { path: 'attendance', component: AttendanceComponent },
      { path: 'tasks', component: TasksComponent },
      {
        path: 'tasks/:taskId/:courseId/grades',
        component: UpdateGradesComponent,
      },
      { path: 'grades', component: FinalGradesComponent },
      { path: 'statistics', component: StatisticsComponent },
      { path: 'settings', component: ChangePasswordComponent },
    ],
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

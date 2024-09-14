import { NgModule, APP_INITIALIZER } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { CoursesListComponent } from './components/courses/courses-list/courses-list.component';
import { LoginComponent } from './components/login/login.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { FlexLayoutServerModule } from 'ngx-flexible-layout/server';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { CoursesComponent } from './components/courses/courses/courses.component';
import { CourseFormComponent } from './components/courses/course-form/course-form.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RegistrationComponent } from './components/registration/registration.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ToastrModule } from 'ngx-toastr';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { AttendanceTableComponent } from './components/attendance/attendance-table/attendance-table.component';
import { CourseUploadComponent } from './components/courses/course-upload/course-upload.component';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CourseDetailsComponent } from './components/courses/course-details/course-details.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { StudentFormComponent } from './components/student-form/student-form.component';
import { CourseSelectComponent } from './components/courses/course-select/course-select.component';
import { TasksComponent } from './components/tasks/tasks.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    CoursesComponent,
    CoursesListComponent,
    CourseFormComponent,
    RegistrationComponent,
    AttendanceComponent,
    AttendanceTableComponent,
    CourseUploadComponent,
    PageNotFoundComponent,
    CourseDetailsComponent,
    StudentFormComponent,
    CourseSelectComponent,
    TasksComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    FlexLayoutServerModule,

    MatListModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatTableModule,
    MatSelectModule,
    MatCardModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,

    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

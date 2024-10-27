
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Ajout pour *ngIf
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student';


@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,       // Pour les directives *ngIf
    ReactiveFormsModule, // Pour formGroup
    RouterModule        // Pour routerLink
  ],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(
    private studentService: StudentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.students = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des étudiants';
        this.loading = false;
      }
    });
  }

  deleteStudent(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      this.studentService.deleteStudent(id).subscribe({
        next: () => {
          this.students = this.students.filter(student => student.id !== id);
        },
        error: (error) => {
          this.error = 'Erreur lors de la suppression';
        }
      });
    }
  }

  editStudent(id: number): void {
    this.router.navigate(['/students/edit', id]);
  }

  viewDetails(id: number): void {
    this.router.navigate(['/students', id]);
  }
}
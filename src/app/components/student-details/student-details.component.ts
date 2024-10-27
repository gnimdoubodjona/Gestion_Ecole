
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Ajout pour *ngIf
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student';

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [
    CommonModule,       // Pour les directives *ngIf
    ReactiveFormsModule, // Pour formGroup
    RouterModule        // Pour routerLink
  ],
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.css']
})
export class StudentDetailsComponent implements OnInit {
  student: Student | null = null;
  loading: boolean = true;
  error: string = '';

  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadStudent(+id);
    }
  }

  loadStudent(id: number): void {
    this.loading = true;
    this.studentService.getStudent(id).subscribe({
      next: (data) => {
        this.student = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des détails de l\'étudiant';
        this.loading = false;
      }
    });
  }

  onEdit(): void {
    if (this.student?.id) {
      this.router.navigate(['/students/edit', this.student.id]);
    }
  }

  onDelete(): void {
    if (this.student?.id && confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      this.studentService.deleteStudent(this.student.id).subscribe({
        next: () => {
          this.router.navigate(['/students']);
        },
        error: (error) => {
          this.error = 'Erreur lors de la suppression';
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/students']);
  }
}
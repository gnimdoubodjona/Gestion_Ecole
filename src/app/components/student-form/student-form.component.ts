
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Ajout pour *ngIf
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [
    CommonModule,       // Pour les directives *ngIf
    ReactiveFormsModule, // Pour formGroup
    RouterModule        // Pour routerLink
  ],
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit {
  studentForm: FormGroup;
  isEditing: boolean = false; //nous permet de savoir si le formulaire est en mode édition
  studentId: number | null = null;
  error: string = '';

  //initialisation du formulaire avec les champs requis
  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      fee: ['', [Validators.required, Validators.min(0)]]
    });
  }

  //méthode qui vérifie si l'étudiant ajouté existe déjà ou pas, s'il existe on passe en mode edit
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.studentId = +id;
      this.loadStudent(this.studentId);
    }
  }

  //méthode qui recupère les attrivuts de l'étudiant après sa modification si ça marche, sinon envoie le message d'erreur
  loadStudent(id: number): void {
    this.studentService.getStudent(id).subscribe({
      next: (student) => {
        this.studentForm.patchValue(student);
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement de l\'étudiant';
      }
    });
  }

  //Cette méthode est appelée lors de la soumission du formulaire. Si le formulaire est valide, elle vérifie si l'utilisateur est en mode édition ou non. Selon le cas, elle appelle le service pour mettre à jour ou créer un nouvel étudiant, puis redirige vers la liste des étudiants. En cas d'erreur, elle définit un message d'erreur.
  onSubmit(): void {
    if (this.studentForm.valid) {
      const studentData = this.studentForm.value;
      
      if (this.isEditing && this.studentId) {
        this.studentService.updateStudent(this.studentId, studentData).subscribe({
          next: () => this.router.navigate(['/students']),
          error: (error) => this.error = 'Erreur lors de la modification'
        });
      } else {
        this.studentService.createStudent(studentData).subscribe({
          next: () => this.router.navigate(['/students']),
          error: (error) => this.error = 'Erreur lors de la création'
        });
      }
    }
  }
}
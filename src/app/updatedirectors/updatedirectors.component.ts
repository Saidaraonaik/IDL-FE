import { Component } from '@angular/core';
import { Director } from '../director';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-updatedirectors',
  templateUrl: './updatedirectors.component.html',
  styleUrls: ['./updatedirectors.component.css']
})
export class UpdatedirectorsComponent {

  collapsed = false;
  selectedFile: File | null = null;
  imageSrc: string | ArrayBuffer | null = null;
  directors: Director = new Director();
  id: number;
  private apiUrl= environment.apiUrl;
  constructor(private authService: AuthServiceService, private router: Router, private route: ActivatedRoute) {}

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

  searchQuery: string = '';
  isAdmin: boolean = false;

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.authService.fetchDirectorById(this.id).subscribe(data => {
      this.directors = data;
      if (this.directors.image) {
        this.imageSrc = `${this.apiUrl}${this.directors.image}`;
      }
    },
    error => console.log(error));
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => this.imageSrc = reader.result;
    reader.readAsDataURL(this.selectedFile);
  }

  onSubmit(): void {
    this.authService.updateDirector(this.id, this.directors, this.selectedFile).subscribe(data => {
      this.router.navigate(['/directorlist']);
    }, error => console.log(error));
  }
}

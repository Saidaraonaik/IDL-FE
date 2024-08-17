import { Component, OnInit } from '@angular/core';
import { Kmp } from '../kmp';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-updatekmp',
  templateUrl: './updatekmp.component.html',
  styleUrls: ['./updatekmp.component.css']
})
export class UpdatekmpComponent implements OnInit {

  collapsed = false;
  selectedImageFile: File | null = null;
  selectedResumeFile: File | null = null;
  imageSrc: string | ArrayBuffer | null = null;
  resumeSrc: string | ArrayBuffer | null = null;
  kmp: Kmp = new Kmp();
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
    this.authService.fetchKmpById(this.id).subscribe(data => {
      this.kmp = data;
      if (this.kmp.image) {
        this.imageSrc = `${this.apiUrl}${this.kmp.image}`;
      }
      if (this.kmp.resume) {
        this.resumeSrc = `${this.apiUrl}${this.kmp.resume}`;
      }
    },
    error => console.log(error));
  }

  onImageFileSelected(event: any): void {
    this.selectedImageFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => this.imageSrc = reader.result;
    reader.readAsDataURL(this.selectedImageFile);
  }

  onResumeFileSelected(event: any): void {
    this.selectedResumeFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => this.resumeSrc = reader.result;
    reader.readAsDataURL(this.selectedResumeFile);
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('name', this.kmp.name as string);
    formData.append('email', this.kmp.email as string);
    formData.append('aadharNo', this.kmp.aadharNo.toString());
    formData.append('passportNo', this.kmp.passportNo as string);
    formData.append('panNo', this.kmp.panNo as string);
    formData.append('designation', this.kmp.designation);
    formData.append('address', this.kmp.address);
    formData.append('state', this.kmp.state);
    formData.append('mobileNo', this.kmp.mobileNo.toString());
    formData.append('active', this.kmp.active.toString());
    formData.append('companyid', this.kmp.company.companyid.toString());

    if (this.selectedImageFile) {
      formData.append('image', this.selectedImageFile);
    }
    if (this.selectedResumeFile) {
      formData.append('resume', this.selectedResumeFile);
    }

    this.authService.updateKmp(this.id, formData).subscribe(data => {
      this.router.navigate(['/kmplist']);
    }, error => console.log(error));
  }
}

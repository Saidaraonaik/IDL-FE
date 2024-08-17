import { Component, OnInit } from '@angular/core';
import { Organization } from '../organization';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-updateorg',
  templateUrl: './updateorg.component.html',
  styleUrls: ['./updateorg.component.css']
})
export class UpdateorgComponent implements OnInit {

  collapsed = false;
  selectedFile: File | null = null;
  imageSrc: string | ArrayBuffer | null = null;
  org: Organization = new Organization();
  companyid: number;
  private apiUrl= environment.apiUrl;

  constructor(private authService: AuthServiceService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.companyid = this.route.snapshot.params['companyid'];
    this.authService.fetchOrganizationById(this.companyid).subscribe(data => {
      this.org = data;
      if (this.org.image) {
        this.imageSrc = `${this.apiUrl}${this.org.image}`;
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
    this.authService.updateOrganization(this.companyid, this.org, this.selectedFile).subscribe(data => {
      this.router.navigate(['/orglist']);
    }, error => console.log(error));
  }

  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
  }
}

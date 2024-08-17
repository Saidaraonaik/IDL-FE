import { Component, OnInit } from '@angular/core';
import { Organization } from '../organization';
import { AuthServiceService } from '../auth-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-companylist',
  templateUrl: './companylist.component.html',
  styleUrls: ['./companylist.component.css']
})
export class CompanylistComponent implements OnInit {

   company: Organization[] = [];
   private apiUrl= environment.apiUrl;

  constructor(private service: AuthServiceService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.companylist();
  }

  storeid(id: number) {
    localStorage.setItem('companyid', id.toString());
    this.router.navigate(['/home', id]);
  }

  companylist() {
    this.service.getAllOrganization().subscribe(data => {
      this.company = data;
    });
  }

  getImageUrl(image: string): string {
    return `${this.apiUrl}${image}`;
  }  

}

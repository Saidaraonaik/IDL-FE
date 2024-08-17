import { Component, OnInit } from '@angular/core';
import { Organization } from '../organization';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-vieworg',
  templateUrl: './vieworg.component.html',
  styleUrls: ['./vieworg.component.css']
})
export class VieworgComponent implements OnInit{

  collapsed = false;

toggleSidebar() {
  this.collapsed = !this.collapsed;
} 

searchQuery: string='';
isAdmin: boolean=false;
  
  org:Organization= new Organization();
  companyid: number;
  imageUrl: string;
  private apiUrl= environment.apiUrl;

  constructor(private authService:AuthServiceService,private router: Router, private route:ActivatedRoute){ }

  ngOnInit(): void {
    this.companyid = this.route.snapshot.params['companyid'];
    this.authService.fetchOrganizationById(this.companyid).subscribe(
      data => {
        this.org = data;
        this.imageUrl = `${this.apiUrl}${this.org.image}`;
        console.log('Image URL:', this.imageUrl);
      },
      error => console.log(error)
    );
  }



}

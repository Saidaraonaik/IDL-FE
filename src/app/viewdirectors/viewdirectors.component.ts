import { Component } from '@angular/core';
import { Director } from '../director';
import { ActivatedRoute } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-viewdirectors',
  templateUrl: './viewdirectors.component.html',
  styleUrls: ['./viewdirectors.component.css']
})
export class ViewdirectorsComponent {

  collapsed = false;

toggleSidebar() {
  this.collapsed = !this.collapsed;
} 

searchQuery: string='';
isAdmin: boolean=false;

  directors:Director = new Director();
  imageUrl: string;
  id: number;
  private apiUrl= environment.apiUrl;

  constructor(private authService:AuthServiceService,private route:ActivatedRoute){ }

  ngOnInit(): void {
    this.id=this.route.snapshot.params['id'];
    this.authService.fetchDirectorById(this.id).subscribe(data=>{
      this.directors=data;
      this.imageUrl = `${this.apiUrl}${this.directors.image}`;
      console.log(data);
    },
    error=>console.log(error));
  }


}

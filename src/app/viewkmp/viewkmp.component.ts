import { Component, OnInit } from '@angular/core';
import { Kmp } from '../kmp';
import { ActivatedRoute } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-viewkmp',
  templateUrl: './viewkmp.component.html',
  styleUrls: ['./viewkmp.component.css']
})
export class ViewkmpComponent implements OnInit {

  collapsed = false;
  imageUrl: string;
  resumeUrl: SafeResourceUrl;

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

  searchQuery: string = '';
  isAdmin: boolean = false;

  kmp: Kmp;
  id: number;
  private apiUrl= environment.apiUrl;

  constructor(
    private authService: AuthServiceService, 
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.authService.fetchKmpById(this.id).subscribe(data => {
      this.kmp = data;
      this.imageUrl = `${this.apiUrl}${this.kmp.image}`;
      this.setResumeUrl(`${this.apiUrl}${this.kmp.resume}`);
      console.log(data);
    },
    error => console.log(error));
  }

  setResumeUrl(url: string): void {
    const extension = url.split('.').pop().toLowerCase();
    this.resumeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

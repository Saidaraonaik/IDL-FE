import { Component } from '@angular/core';
import { Esi } from '../esi';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-addesi',
  templateUrl: './addesi.component.html',
  styleUrls: ['./addesi.component.css']
})
export class AddesiComponent {

  collapsed = false;
  regForm: FormGroup;

toggleSidebar() {
  this.collapsed = !this.collapsed;
} 

searchQuery: string='';
isAdmin: boolean=false;

  esi:Esi = {
    employerCodeNo:null,
    employerName: '',
    ro: '',
    lin:null,
    active:null,
    userid: '',
    password: '',
    emailId: '',
    mobileNo: null,
    signatory: '',
    company: {
      companyid:null
    }
  }

  constructor(private authService: AuthServiceService, private router: Router) {
    this.regForm = new FormGroup({
      employeeCode: new FormControl(this.esi.employerCodeNo, [Validators.required,
        Validators.minLength(15),
        Validators.maxLength(30)
      ]),
      employeeName: new FormControl(this.esi.employerName, [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[A-Za-z\s]+$/)
      ]),
      ro: new FormControl(this.esi.ro, [Validators.required]),
      lin: new FormControl(this.esi.lin, [Validators.required,
        Validators.minLength(10),
        Validators.maxLength(30)
      ]),
      active: new FormControl(this.esi.active, [Validators.required]),
      userid: new FormControl(this.esi.userid, [Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30)
      ]),
      password: new FormControl(this.esi.password, [Validators.required]),
      email: new FormControl(this.esi.emailId, [Validators.required,
         Validators.email,
         Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[c][o][m]$/)
        ]),
      mobileno: new FormControl(this.esi.mobileNo, [Validators.required,
        Validators.pattern(/^[6-9][0-9]{9}$/),
        Validators.minLength(10),
        Validators.maxLength(10)
      ]),
      signatory: new FormControl(this.esi.signatory, [Validators.required,
        Validators.pattern(/^[A-Za-z\s]+$/),
      ]),
  
    });
  }

  ngOnInit(): void {
    const companyId = localStorage.getItem('companyid');
    if (companyId) {
      this.esi.company.companyid = +companyId;
    } else {
      console.error('Company ID not found in local storage.');
    }
  }

  onSubmit(): void {
    this.authService.createEsi(this.esi).subscribe(
      response => {
        console.log('Esi registered successfully:', response);
        this.router.navigate(['/esilist']); 
      },
      error => {
        console.error('Error registering Esi:', error);
      }
    );
  }

}
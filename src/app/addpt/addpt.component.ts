import { Component } from '@angular/core';
import { Pt } from '../pt';
import { AuthServiceService } from '../auth-service.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-addpt',
  templateUrl: './addpt.component.html',
  styleUrls: ['./addpt.component.css']
})
export class AddptComponent {

  collapsed = false;
  regForm: FormGroup;
toggleSidebar() {
  this.collapsed = !this.collapsed;
}
  pt:Pt = {
    ptinSal: '',
    ptinCom:  '',
    taxDivision:  '',
    taxCircle:  '',
    mobileNo:  '',
    email:  '',
    dateOfEnrollment:  '',
    userid:  '',
    password:  '',
    active:null,
    company: {
      companyid:null
    }
  };
  
  constructor(private authService:AuthServiceService, private router: Router) {
    this.regForm = new FormGroup({
      ptinSal: new FormControl(this.pt.ptinSal, [Validators.required,
        Validators.minLength(5),
          Validators.maxLength(10)
      ]),
      ptinCom: new FormControl(this.pt.ptinCom, [Validators.required,
        Validators.minLength(5),
          Validators.maxLength(30)
      ]),
      taxDivision: new FormControl(this.pt.taxDivision, [Validators.required]),
      taxCircle: new FormControl(this.pt.taxCircle, [Validators.required]),
      mobileNo: new FormControl(this.pt.mobileNo, [Validators.required,
        Validators.pattern(/^[6-9][0-9]{9}$/),
        Validators.minLength(10),
        Validators.maxLength(10)
        ]),
      email: new FormControl(this.pt.email, [Validators.required,
         Validators.email,
         Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[c][o][m]$/)
        ]),
      dateOfEnrollment: new FormControl(this.pt.dateOfEnrollment, [Validators.required]),
      userid: new FormControl(this.pt.userid, [Validators.required,
        Validators.minLength(6),
          Validators.maxLength(30)
      ]),
      password: new FormControl(this.pt.password, [Validators.required]),
      active: new FormControl(this.pt.active, [Validators.required]),
    });
  
    }
  ngOnInit(): void {
    const companyId = localStorage.getItem('companyid');
    if (companyId) {
      this.pt.company.companyid = +companyId;
    } else {
      console.error('Company ID not found in local storage.');
    }
  }
  onSubmit() : void{
    this.authService.createPt(this.pt).subscribe(
      response => {
        console.log('Bank registered successfully:', response);
        this.router.navigate(['/ptlist']); // Navigate to the bank list after successful registration
      },
      error => {
        console.error('Error registering pt:', error);
      }
    );
  }
}
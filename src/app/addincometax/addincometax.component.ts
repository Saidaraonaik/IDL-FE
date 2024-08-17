import { Component } from '@angular/core';
import { Incometax } from '../incometax';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-addincometax',
  templateUrl: './addincometax.component.html',
  styleUrls: ['./addincometax.component.css']
})
export class AddincometaxComponent {

  collapsed = false;
  regForm: FormGroup;

toggleSidebar() {
  this.collapsed = !this.collapsed;
} 

searchQuery: string='';
isAdmin: boolean=false;

  tax:Incometax = {
    panNumber:  '',
  name:  '',
  panIssuedDate:  '',
  primaryMobile: null,
  secondaryMobile:  null,
  primaryEmail:  '',
  secondaryEmail:  '',
  userid:  '',
  password:  '',
  active:null,
  primarysignatory:'',
  secondarysignatory:'',
  incorporationDate:'',
  company: {
    companyid:null
  }
  };
  companyId: number;

  constructor(private authService: AuthServiceService, private router: Router) {
    this.regForm = new FormGroup({
      panNumber: new FormControl(this.tax.panNumber, [Validators.required,
        Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/),
        Validators.minLength(10),
        Validators.maxLength(10)
      ]),
      name: new FormControl(this.tax.name, [Validators.required,
        Validators.pattern(/^[A-Za-z\s]+$/),
        Validators.minLength(3),
        Validators.maxLength(30)
      ]),
      panIssuedDate: new FormControl(this.tax.panIssuedDate, [Validators.required,]),
      primaryMobile: new FormControl(this.tax.primaryMobile, [Validators.required,
        Validators.pattern(/^[6-9][0-9]{9}$/),
        Validators.minLength(10),
        Validators.maxLength(10)
      ]),
      secondaryMobile: new FormControl(this.tax.secondaryMobile, [ ]),
      primaryEmail: new FormControl(this.tax.primaryEmail, [Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[c][o][m]$/)
      ]),
      secondaryEmail: new FormControl(this.tax.secondaryEmail, [ ]),
      userid: new FormControl(this.tax.userid, [Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30)
      ]),
      password: new FormControl(this.tax.password, [Validators.required,
      ]),
      active: new FormControl(this.tax.active, [Validators.required,]),
      primarysignatory: new FormControl(this.tax.primarysignatory, [Validators.pattern(/^[A-Za-z\s]+$/),]),
      secondarysignatory: new FormControl(this.tax.secondarysignatory, [Validators.pattern(/^[A-Za-z\s]+$/),]),
      incorporationDate: new FormControl(this.tax.incorporationDate, [Validators.required,]),
    }
  );
  }

  ngOnInit(): void {
    const companyId = localStorage.getItem('companyid');
    if (companyId) {
      this.tax.company.companyid = +companyId;
    } else {
      console.error('Company ID not found in local storage.');
    }
  }

  onSubmit(): void {
    this.authService.createIncometax(this.tax).subscribe(
      response => {
        console.log('IncomeTax registered successfully:', response);
        this.router.navigate(['/incometaxlist']); // Navigate to the bank list after successful registration
      },
      error => {
        console.error('Error registering incometax:', error);
      }
    );
  }

}

import { Component } from '@angular/core';
import { Tds } from '../tds';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-addtds',
  templateUrl: './addtds.component.html',
  styleUrls: ['./addtds.component.css']
})
export class AddtdsComponent {

  collapsed = false;
  regForm: FormGroup;

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

  searchQuery: string = '';
  isAdmin: boolean = false;

  tds: Tds = {
    tanNo: '',
    userid: '',
    password: '',
    phoneNumber: null,
    surrendered: null,
    email: '',
    active: null,
    signatory:'',
    company: {
      companyid: null,
    },
  };
  companyId: number;

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {
    this.regForm = new FormGroup({
      tan: new FormControl(this.tds.tanNo, [Validators.required,
        Validators.minLength(10),
        Validators.maxLength(20)
      ]),
      userid: new FormControl(this.tds.userid, [Validators.required,
        Validators.minLength(6),
        Validators.maxLength(36)
      ]),
      password: new FormControl(this.tds.password, [Validators.required,
      ]),
      mobileNo: new FormControl(this.tds.phoneNumber, [Validators.required,
        Validators.pattern(/^[6-9][0-9]{9}$/),
        Validators.minLength(10),
        Validators.maxLength(10)
      ]),
      surrendered: new FormControl(this.tds.surrendered, [Validators.required,]),
      email: new FormControl(this.tds.email, [Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[c][o][m]$/)
      ]),
      active: new FormControl(this.tds.active, [Validators.required,]),
      signatory: new FormControl(this.tds.signatory, [Validators.required,
        Validators.pattern(/^[A-Za-z\s]+$/),
      ]),
    });
  }

  ngOnInit(): void {
    const companyId = localStorage.getItem('companyid');
    if (companyId) {
      this.tds.company.companyid = +companyId;
    } else {
      console.error('Company ID not found in local storage.');
    }
  }

  onSubmit(): void {
    this.authService.createTds(this.tds).subscribe(
      (response) => {
        console.log('Tds registered successfully:', response);
        this.router.navigate(['/tdslist']); // Navigate to the bank list after successful registration
      },
      (error) => {
        console.error('Error registering Tds:', error);
      }
    );
  }

}

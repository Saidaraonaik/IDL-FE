import { Component } from '@angular/core';
import { Epf } from '../epf';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-epf',
  templateUrl: './add-epf.component.html',
  styleUrls: ['./add-epf.component.css']
})
export class AddEpfComponent {

  collapsed = false;
  regForm: FormGroup;

toggleSidebar() {
  this.collapsed = !this.collapsed;
} 

searchQuery: string='';
isAdmin: boolean=false;

  epf:Epf = {
    estid: '',
    lin:null,
    niccode: '',
    pfOfficeAddress: '',
    signatory: '',
    active:null,
    userid: '',
    password: '',
    emailId: '',
    mobileNo: null,
    company: {
      companyid:null
    }
  };
  companyId: number;

  constructor(private authService: AuthServiceService, private router: Router) {
    this.regForm = new FormGroup({
      estid: new FormControl(this.epf.estid, [Validators.required,]),
      lin: new FormControl(this.epf.lin, [Validators.required,
      Validators.minLength(10),
      Validators.maxLength(30),
      Validators.pattern(/^[0-9]{10,16}$/)
      ]),
      niccode: new FormControl(this.epf.niccode, [Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20)
      ]),
      pfOfficeAddress: new FormControl(this.epf.pfOfficeAddress, [Validators.required]),
      signatory: new FormControl(this.epf.signatory, [Validators.required,
        Validators.pattern(/^[A-Za-z\s]+$/),
      ]),
      active: new FormControl(this.epf.active, [Validators.required]),
      userid: new FormControl(this.epf.userid, [Validators.required,
      Validators.minLength(6),
      Validators.maxLength(30)
      ]),
      password: new FormControl(this.epf.password, [Validators.required]),
      emailId: new FormControl(this.epf.emailId, [Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[c][o][m]$/)
      ]),
      mobileNo: new FormControl(this.epf.mobileNo, [Validators.required,
      Validators.pattern(/^[6-9][0-9]{9}$/),
      Validators.minLength(10),
      Validators.maxLength(10)
      ]),
    });

  }

  ngOnInit(): void {
    const companyId = localStorage.getItem('companyid');
    if (companyId) {
      this.epf.company.companyid = +companyId;
    } else {
      console.error('Company ID not found in local storage.');
    }
  }

  onSubmit(): void {
    this.authService.createEpf(this.epf).subscribe(
      response => {
        console.log('Epf registered successfully:', response);
        this.router.navigate(['/epflist']); // Navigate to the bank list after successful registration
      },
      error => {
        console.error('Error registering epf:', error);
      }
    );
  }

}
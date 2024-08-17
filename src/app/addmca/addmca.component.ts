import { Component } from '@angular/core';
import { Mca } from '../mca';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-addmca',
  templateUrl: './addmca.component.html',
  styleUrls: ['./addmca.component.css']
})
export class AddmcaComponent {

  collapsed = false;
  regForm: FormGroup;

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

  searchQuery: string = '';
  isAdmin: boolean = false;

  mca: Mca = {
    authorisedCapital:'',
    cin:'',
    classOfCompany:'',
    dateOfIncorporation:'',
    email:'',
    mobileNo:'',
    paidUpCapital:'',
    registeredAddress:'',
    registrationNo:'',
    rocName:'',
    stockExchanges:'',
    telephone:'',
    v2emailId:'',
    v2loginid:'',
    v2password:'',
    v3emailId:'',
    v3loginid:'',
    v3password:'',
    active: null,

    company: {
      companyid: null,
    },
  };
  companyId: number;

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.regForm = new FormGroup({
      authorisedCapital: new FormControl(this.mca.authorisedCapital, [Validators.required,
      ]),
      cin: new FormControl(this.mca.cin, [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(30)
      ]),
      classOfCompany: new FormControl(this.mca.classOfCompany, [Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        Validators.pattern(/^[A-Za-z\s]+$/)
      ]),
      dateOfIncorporation: new FormControl(this.mca.dateOfIncorporation, [Validators.required,]),
      email: new FormControl(this.mca.email, [Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[c][o][m]$/)
      ]),
      mobileNo: new FormControl(this.mca.mobileNo, [Validators.required,
        Validators.pattern(/^[6-9][0-9]{9}$/),
        Validators.minLength(10),
        Validators.maxLength(10)
      ]),
      paidUpCapital: new FormControl(this.mca.paidUpCapital, [Validators.required,]),
      registeredAddress: new FormControl(this.mca.registeredAddress, [Validators.required,]),
      registrationNo: new FormControl(this.mca.registrationNo, [Validators.required,]),
      rocName: new FormControl(this.mca.rocName, [Validators.required,]),
      stockExchanges: new FormControl(this.mca.stockExchanges, [Validators.required,Validators.pattern(/^[A-Za-z]+$/)]),
      telephone: new FormControl(this.mca.telephone, [Validators.required,
        Validators.pattern(/^[0-9]{10,15}$/),
        Validators.minLength(10),
        Validators.maxLength(15)
      ]),
      v2emailId: new FormControl(this.mca.v2emailId, [Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[c][o][m]$/)
      ]),
      v2loginid: new FormControl(this.mca.v2loginid, [Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30)
      ]),
      v2password: new FormControl(this.mca.v2password, [Validators.required,
        
      ]),
      v3emailId: new FormControl(this.mca.v3emailId, [Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[c][o][m]$/)
      ]),
      v3loginid: new FormControl(this.mca.v3loginid, [Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30)
      ]),
      v3password: new FormControl(this.mca.v3password, [Validators.required,
         
      ]),
      active: new FormControl(this.mca.active, [Validators.required,])
    });
  }


  ngOnInit(): void {
    const companyId = localStorage.getItem('companyid');
    if (companyId) {
      this.mca.company.companyid = +companyId;
    } else {
      console.error('Company ID not found in local storage.');
    }
  }

  onSubmit(): void {
    this.authService.createMca(this.mca).subscribe(
      (response) => {
        console.log('MCA registered successfully:', response);
        this.router.navigate(['/mcalist']); // Navigate to the bank list after successful registration
      },
      (error) => {
        console.error('Error registering MCA:', error);
      }
    );
  }

}


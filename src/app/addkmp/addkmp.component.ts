import { Component } from '@angular/core';
import { Kmp } from '../kmp';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-addkmp',
  templateUrl: './addkmp.component.html',
  styleUrls: ['./addkmp.component.css']
})
export class AddkmpComponent {

  collapsed = false;
  regForm: FormGroup;

toggleSidebar() {
  this.collapsed = !this.collapsed;
} 

searchQuery: string='';
isAdmin: boolean=false;
imageSrc: string | ArrayBuffer | null = null;
resumeSrc: string | ArrayBuffer | null = null;
selectedImageFile: File | null = null;
selectedResumeFile: File | null = null;

  kmp:Kmp = {
    name:  '',
  email:  '',
  aadharNo: null,
  passportNo:  '',
  panNo:  '', 
  resume:  '',
  active:null,
  designation: '',
  address: '',
  state: '',
  image: '',
  mobileNo:null,
  company: {
    companyid:null
  }
  };

  constructor(private authService: AuthServiceService, private router: Router) {
    this.regForm = new FormGroup({
      name: new FormControl(this.kmp.name, [Validators.required,
        Validators.pattern(/^[A-Za-z\s]+$/),
        Validators.minLength(3),
        Validators.maxLength(30)
      ]),
      email: new FormControl(this.kmp.email, [Validators.required,
         Validators.email,
         Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[c][o][m]$/)
        ]),
      aadharNo: new FormControl(this.kmp.aadharNo, [Validators.required,
       Validators.pattern(/^[0-9]{12}$/),
       Validators.minLength(12),
       Validators.maxLength(15)
      ]),
      passportNo: new FormControl(this.kmp.passportNo, [Validators.required,
        Validators.minLength(6),
        Validators.maxLength(15)
      ]),
      panNo: new FormControl(this.kmp.panNo, [Validators.required,
        Validators.pattern(/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/),
        Validators.minLength(10),
        Validators.maxLength(15)
      ]),
      active: new FormControl(this.kmp.active, [Validators.required]),
      designation: new FormControl(this.kmp.designation, [Validators.required]),
      address: new FormControl(this.kmp.address, [Validators.required]),
      state: new FormControl(this.kmp.state, [Validators.required]),
      mobileNo: new FormControl(this.kmp.mobileNo, [Validators.required,
        Validators.pattern(/^[6-9][0-9]{9}$/),
        Validators.minLength(10),
        Validators.maxLength(10)
        ]),
    });

  }


  ngOnInit(): void {
    const companyId = localStorage.getItem('companyid');
    if (companyId) {
      this.kmp.company.companyid = +companyId;
    } else {
      console.error('Company ID not found in local storage.');
    }
  }

  onImageFileChange(event: any): void {
    const file = event.target.files[0];
    if (file){
      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSrc = e.target?.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  onResumeFileChange(event: any): void {
    const file = event.target.files[0];
    if (file){
      this.selectedResumeFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.resumeSrc = e.target?.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.regForm.valid) {
      const formData = new FormData();
      formData.append('name', this.regForm.get('name')?.value);
      formData.append('email', this.regForm.get('email')?.value);
      formData.append('aadharNo', this.regForm.get('aadharNo')?.value);
      formData.append('passportNo', this.regForm.get('passportNo')?.value);
      formData.append('panNo', this.regForm.get('panNo')?.value);
      formData.append('designation', this.regForm.get('designation')?.value);
      formData.append('address', this.regForm.get('address')?.value);
      formData.append('state', this.regForm.get('state')?.value);
      formData.append('mobileNo', this.regForm.get('mobileNo')?.value);
      formData.append('active', this.regForm.get('active')?.value);
      formData.append('companyid', this.kmp.company.companyid.toString());
  
      if (this.selectedImageFile) {
        formData.append('image', this.selectedImageFile as File);
      }
      if (this.selectedResumeFile) {
        formData.append('resume', this.selectedResumeFile as File);
      }
  
      this.authService.createKmp(formData).subscribe(
        response => {
          console.log('KMP registered successfully:', response);
          this.router.navigate(['/kmplist']);
        },
        error => {
          console.error('Error registering KMP:', error);
        }
      );
    }
  }
  
  

}
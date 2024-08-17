import { Component } from '@angular/core';
import { Organization } from '../organization';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyDTO } from '../company-dto';

@Component({
  selector: 'app-addorg',
  templateUrl: './addorg.component.html',
  styleUrls: ['./addorg.component.css']
})
export class AddorgComponent {


  collapsed = false;
  regForm: FormGroup;
  imageSrc: string | ArrayBuffer | null = null;

toggleSidebar() {
  this.collapsed = !this.collapsed;
} 

searchQuery: string='';
isAdmin: boolean=false;
selectedFile: File | null = null;

  org:CompanyDTO= new CompanyDTO();

  constructor(private authService: AuthServiceService, private router: Router) {
    this.regForm = new FormGroup({
      // companyid: new FormControl('', [Validators.required]),
      companyCode: new FormControl('', [Validators.required]),
      cin: new FormControl('', [Validators.required,
        Validators.minLength(15),
        Validators.maxLength(30)
      ]),
      companyname: new FormControl('', [Validators.required,
        Validators.pattern(/^[A-Za-z\s]+$/),
        Validators.minLength(6),
        Validators.maxLength(50)
      ]),
      dateOfIncorporation: new FormControl('', [Validators.required]),
      registerNo: new FormControl('', [Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30)
      ]),
      phoneNo: new FormControl('', [Validators.required,
        Validators.pattern(/^[6-9][0-9]{9}$/),
        Validators.minLength(10),
        Validators.maxLength(10)
      ]),
      email: new FormControl('', [Validators.required,
         Validators.email,
         Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[c][o][m]$/)
        ]),
      address: new FormControl('', [Validators.required]),
      website: new FormControl('', [Validators.required]),
      telephoneNo: new FormControl('', [Validators.required,
        Validators.minLength(11),
        Validators.maxLength(20)
      ]),
      faxNo: new FormControl('', [Validators.required,
        Validators.minLength(10),
        Validators.maxLength(20)
      ]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      pincode: new FormControl('', [Validators.required,
        Validators.minLength(6),
        Validators.maxLength(15)
      ]),
      active: new FormControl(this.org.active, [Validators.required]),
      image: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.org = new CompanyDTO();
  }


  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSrc = e.target?.result;
      };
      reader.readAsDataURL(file);
    }
  }


  onSubmit(): void {
    if (this.regForm.valid) {
      const formData = new FormData();
      formData.append('companyCode', this.regForm.get('companyCode')?.value);
      formData.append('companyname', this.regForm.get('companyname')?.value);
      formData.append('cin', this.regForm.get('cin')?.value);
      formData.append('registerNo', this.regForm.get('registerNo')?.value);
      formData.append('dateOfIncorporation', this.regForm.get('dateOfIncorporation')?.value);
      formData.append('address', this.regForm.get('address')?.value);
      formData.append('city', this.regForm.get('city')?.value);
      formData.append('state', this.regForm.get('state')?.value);
      formData.append('pincode', this.regForm.get('pincode')?.value);
      formData.append('email', this.regForm.get('email')?.value);
      formData.append('phoneNo', this.regForm.get('phoneNo')?.value);
      formData.append('telephoneNo', this.regForm.get('telephoneNo')?.value);
      formData.append('faxNo', this.regForm.get('faxNo')?.value);
      formData.append('website', this.regForm.get('website')?.value);
      formData.append('logoName', this.selectedFile as File);
      formData.append('active', this.regForm.get('active')?.value);

      this.authService.createCompany(formData).subscribe(response => {
        console.log(response); 
        this.router.navigate(['/orglist']);
      });
    }
  }

  
}

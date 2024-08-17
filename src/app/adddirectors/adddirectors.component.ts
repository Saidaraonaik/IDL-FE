import { Component } from '@angular/core';
import { Director } from '../director';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-adddirectors',
  templateUrl: './adddirectors.component.html',
  styleUrls: ['./adddirectors.component.css'],
})
export class AdddirectorsComponent {
  collapsed = false;
  regForm: FormGroup;

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }
  imageSrc: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  searchQuery: string = '';
  isAdmin: boolean = false;

  directors: Director = {
    name: '',
    email: '',
    dinNo: null,
    panNo: '',
    passportNo: '',
    dateOfAppointment: '',
    dateOfExit: '',
    address: '',
    active: null,
    designation: '',
    aadharNo:null,
    mobileNo:null,
    image: '',
    company: {
      companyid: null,
    },
  };

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.regForm = new FormGroup({
      name: new FormControl(this.directors.name, [Validators.required,
        Validators.pattern(/^[A-Za-z\s]+$/),
        Validators.minLength(3),
        Validators.maxLength(30)
      ]),
      email: new FormControl(this.directors.email, [Validators.required,
         Validators.email,
         Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[c][o][m]$/)
        ]),
      dinNo: new FormControl(this.directors.dinNo, [Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        Validators.pattern(/^[0-9]+$/)
      ]),
      panNo: new FormControl(this.directors.panNo, [Validators.required,
        Validators.pattern(/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/),
        Validators.minLength(10),
        Validators.maxLength(15)
      ]),
      passportNo: new FormControl(this.directors.passportNo, [Validators.required,
        Validators.minLength(6),
        Validators.maxLength(15)
      ]),
      dateOfAppointment: new FormControl(this.directors.dateOfAppointment, [Validators.required]), 
      address: new FormControl(this.directors.address, [Validators.required]),
      active: new FormControl(this.directors.active, [Validators.required]),
      designation: new FormControl(this.directors.designation, [Validators.required]),
      aadharNo: new FormControl(this.directors.aadharNo, [Validators.required,
        Validators.minLength(12),
        Validators.maxLength(15),
        Validators.pattern(/^[0-9]{12}$/),
      ]),
      mobileNo: new FormControl(this.directors.mobileNo, [Validators.required,
        Validators.pattern(/^[6-9][0-9]{9}$/),
        Validators.minLength(10),
        Validators.maxLength(10)
      ]),
    });
  }

  ngOnInit(): void {
    const companyId = localStorage.getItem('companyid');
    if (companyId) {
      this.directors.company.companyid = +companyId;
    } else {
      console.error('Company ID not found in local storage.');
    }
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
      formData.append('name', this.regForm.get('name')?.value);
      formData.append('email', this.regForm.get('email')?.value);
      formData.append('dinNo', this.regForm.get('dinNo')?.value);
      formData.append('panNo', this.regForm.get('panNo')?.value);
      formData.append('passportNo', this.regForm.get('passportNo')?.value);
      formData.append('dateOfAppointment', this.regForm.get('dateOfAppointment')?.value);
      formData.append('dateOfExit', this.regForm.get('dateOfExit')?.value);
      formData.append('address', this.regForm.get('address')?.value);
      formData.append('active', this.regForm.get('active')?.value);
      formData.append('designation', this.regForm.get('designation')?.value);
      formData.append('aadharNo', this.regForm.get('aadharNo')?.value);
      formData.append('mobileNo', this.regForm.get('mobileNo')?.value);
      formData.append('image', this.selectedFile as File);
      formData.append('companyid', this.directors.company.companyid.toString());

      this.authService.createDirector(formData).subscribe(
        response => {
          console.log('Director registered successfully:', response);
          this.router.navigate(['/directorlist']);
        },
        error => {
          console.error('Error registering director:', error);
        }
      );
    }
  }
}
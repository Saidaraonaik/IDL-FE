export class Kmp {
  id?: number;
  name: String;
  email: String;
  aadharNo: number;
  passportNo: String;
  panNo: String;
  resume: String;
  designation:string;
  address:string;
  state:string;
  image:string;
  mobileNo:number;

  createdBy?: String;
  updatedBy?: String;
  createdDate?: string;
  updatedDate?: string;
  active: boolean=true;

  company: {
    companyid: number;
  };
}

export class Organization {

    companyid:number;
    cin:string
    companyCode:String;
    companyname:String;
    dateOfIncorporation:string;
    registerNo:string;
    phoneNo:number;
    email:String;
    faxNo:string;
    website:String;
    address:string;
    city:String;
    state:String;
    pincode:number;
    telephoneNo:number;
    image:string;

    createdBy:String;
    updatedBy:String;
    createdDate:Date;
    updatedDate:Date;
    active:boolean=true;

    [key: string]: any;
}

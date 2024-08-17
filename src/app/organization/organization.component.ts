import { Component, OnInit, ViewChild } from '@angular/core';
import { Organization } from '../organization';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { MatDialog } from '@angular/material/dialog';
import { DeletedataComponent } from '../deletedata/deletedata.component';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit {
  collapsed = false;
  searchQuery: string = '';
  isAdmin: boolean = false;


  displayedColumns: string[] = ['cin', 'companyname', 'email', 'view', 'edit', 'delete'];
  dataSource: MatTableDataSource<Organization>;
  Columns: string[] = ['cin', 'companyname', 'email', 'view', 'edit', 'delete'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private service: AuthServiceService, private router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.Organization();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  Organization() {
    this.service.getAllOrganization().subscribe((data: Organization[]) => {
      const activeOrganizations = data.filter((organization: Organization) => organization.active);
   
      this.dataSource = new MatTableDataSource(activeOrganizations);
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data: Organization, filter: string) => {
        return data.companyname.toLowerCase().includes(filter) ||
               data.cin.toLowerCase().includes(filter) ||
               data.email.toLowerCase().includes(filter);
      };
    });
  }

  updateOrganization(companyid: number) {
    this.router.navigate(['/updateorg', companyid]);
  }

  deleteOrganization(companyid: number): void {
    const dialogRef = this.dialog.open(DeletedataComponent);
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteOrganization(companyid).subscribe(() => {
          const organization = this.dataSource.data.find(org => org.companyid === companyid);
          if (organization) {
            organization.active = false;
            this.dataSource.filter = this.searchQuery.trim().toLowerCase(); 
          }
          console.log(`Company with ID ${companyid} deleted.`);
        },
        error => console.log(error));
      }
    });
  }

  organizationView(companyid: number) {
    this.router.navigate(['/vieworg', companyid]);
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }
}

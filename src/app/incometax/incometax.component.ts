import { Component, ViewChild, OnInit } from '@angular/core';
import { Incometax } from '../incometax';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { MatDialog } from '@angular/material/dialog';
import { DeletedataComponent } from '../deletedata/deletedata.component';

@Component({
  selector: 'app-incometax',
  templateUrl: './incometax.component.html',
  styleUrls: ['./incometax.component.css']
})
export class IncometaxComponent implements OnInit {

  collapsed = false;
  searchQuery: string = '';
  isAdmin: boolean = false;
  incometaxdetails: Incometax[];
  selectedincometaxId: number | null = null;
  decryptedPassword: string | null = null;
  displayedColumns: string[] = ['panNumber', 'userid', 'password', 'view', 'edit', 'delete'];
  dataSource = new MatTableDataSource<Incometax>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private service: AuthServiceService, private router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.incometaxList();
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  incometaxList() {
    const companyId = localStorage.getItem('companyid');
    if (companyId) {
      this.service.getAllIncometax(+companyId).subscribe(data => {
        this.incometaxdetails = data.filter(incometax => incometax.active); // Filter active records
        this.dataSource.data = this.incometaxdetails;
        this.dataSource.paginator = this.paginator; // Bind paginator
      });
    } else {
      console.error('Company ID is not available in local storage.');
    }
  }

  updateIncometax(id: number) {
    this.router.navigate(['/updateincometax', id]);
  }

  deleteIncometax(id: number): void {
    const dialogRef = this.dialog.open(DeletedataComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteIncometax(id).subscribe(
          data => {
            this.incometaxList(); // Refresh list after deletion
            this.router.navigate(['/incometaxlist']);
          },
          error => console.error(error)
        );
      }
    });
  }

  incometaxView(id: number) {
    this.router.navigate(['/viewincometax', id]);
  }

  getpassword(id: number) {
    this.service.decryptincometax(id).subscribe(
      (data: string) => {
        this.selectedincometaxId = id;
        this.decryptedPassword = data;
      },
      error => console.error('Error decrypting password:', error)
    );
  }

  clearDecryptedPassword() {
    this.selectedincometaxId = null;
    this.decryptedPassword = null;
  }
}

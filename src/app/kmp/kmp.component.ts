import { Component, ViewChild, OnInit } from '@angular/core';
import { Kmp } from '../kmp';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { MatDialog } from '@angular/material/dialog';
import { DeletedataComponent } from '../deletedata/deletedata.component';

@Component({
  selector: 'app-kmp',
  templateUrl: './kmp.component.html',
  styleUrls: ['./kmp.component.css']
})
export class KmpComponent implements OnInit {

  collapsed = false;
  searchQuery: string = '';
  isAdmin: boolean = false;
  kmpDetails: Kmp[];
  displayedColumns: string[] = ['name', 'designation', 'email', 'view', 'edit', 'delete'];
  dataSource = new MatTableDataSource<Kmp>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private service: AuthServiceService, private router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.kmpList();
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  kmpList() {
    const companyId = localStorage.getItem('companyid');
    if (companyId) {
      this.service.getAllKmp(+companyId).subscribe(data => {
        this.kmpDetails = data.filter(kmp => kmp.active); // Filter active records
        this.dataSource.data = this.kmpDetails;
        this.dataSource.paginator = this.paginator; // Bind paginator
      });
    } else {
      console.error('Company ID is not available in local storage.');
    }
  }

  updateKmp(id: number) {
    this.router.navigate(['/updatekmp', id]);
  }

  deleteKmp(id: number): void {
    const dialogRef = this.dialog.open(DeletedataComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteKmp(id).subscribe(
          data => {
            this.kmpList(); // Refresh list after deletion
            this.router.navigate(['/kmplist']);
          },
          error => console.error(error)
        );
      }
    });
  }

  kmpView(id: number) {
    this.router.navigate(['/viewkmp', id]);
  }
}

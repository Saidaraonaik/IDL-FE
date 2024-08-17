import { Component, ViewChild, OnInit } from '@angular/core';
import { Tds } from '../tds';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { MatDialog } from '@angular/material/dialog';
import { DeletedataComponent } from '../deletedata/deletedata.component';

@Component({
  selector: 'app-tds',
  templateUrl: './tds.component.html',
  styleUrls: ['./tds.component.css']
})
export class TdsComponent implements OnInit {

  collapsed = false;
  searchQuery: string = '';
  isAdmin: boolean = false;
  tdsdetails: Tds[];
  selectedTdsId: number | null = null;
  decryptedPassword: string | null = null;
  displayedColumns: string[] = ['tanNo', 'userid', 'password', 'view', 'edit', 'delete'];
  dataSource = new MatTableDataSource<Tds>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private service: AuthServiceService, private router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.tdsList();
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  tdsList() {
    const companyId = localStorage.getItem('companyid');
    if (companyId) {
      this.service.getAllTds(+companyId).subscribe(data => {
        this.tdsdetails = data.filter(tds => tds.active); 
        this.dataSource.data = this.tdsdetails;
        this.dataSource.paginator = this.paginator; 
      });
    } else {
      console.error('Company ID is not available in local storage.');
    }
  }

  updateTds(id: number) {
    this.router.navigate(['/updatetds', id]);
  }

  deleteTds(id: number): void {
    const dialogRef = this.dialog.open(DeletedataComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteTds(id).subscribe(
          data => {
            this.tdsList(); 
            this.router.navigate(['/tdslist']);
          },
          error => console.error(error)
        );
      }
    });
  }

  tdsView(id: number) {
    this.router.navigate(['/viewtds', id]);
  }

  getpassword(id: number) {
    this.service.decryptTds(id).subscribe(
      (data: string) => {
        this.selectedTdsId = id;
        this.decryptedPassword = data;
      },
      error => console.error('Error decrypting password:', error)
    );
  }

  clearDecryptedPassword() {
    this.selectedTdsId = null;
    this.decryptedPassword = null;
  }
}

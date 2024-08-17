import { Component, ViewChild } from '@angular/core';
import { Gst } from '../gst';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { MatDialog } from '@angular/material/dialog';
import { DeletedataComponent } from '../deletedata/deletedata.component';

@Component({
  selector: 'app-gst',
  templateUrl: './gst.component.html',
  styleUrls: ['./gst.component.css']
})
export class GstComponent {
  collapsed = false;
  searchQuery: string = '';
  isAdmin: boolean = false;
  gstdetails: Gst[] = [];
  selectedGstId: number | null = null;
  decryptedPassword: string | null = null;
  displayedColumns: string[] = ['gstNumber', 'state', 'userid', 'password', 'view', 'edit', 'delete'];
  dataSource = new MatTableDataSource<Gst>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private service: AuthServiceService, private router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.gstList();
  }

  gstList() {
    const companyId = localStorage.getItem('companyid');
    this.service.getAllGst(+companyId).subscribe(data => {
      this.gstdetails = data;
      this.dataSource.data = this.gstdetails;
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  updateGst(id: number) {
    this.router.navigate(['/updategst', id]);
  }

  deleteGst(id: number): void {
    const dialogRef = this.dialog.open(DeletedataComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteGst(id).subscribe(
          () => {
            this.gstList();
            this.router.navigate(['/gstlist']);
          },
          error => console.log(error)
        );
      }
    });
  }

  gstView(id: number) {
    this.router.navigate(['/viewgst', id]);
  }

  getpassword(id: number) {
    this.service.decryptgst(id).subscribe(
      (data: string) => {
        this.selectedGstId = id;
        this.decryptedPassword = data;
      },
      error => {
        console.error('Error decrypting password:', error);
      }
    );
  }

  clearDecryptedPassword() {
    this.selectedGstId = null;
    this.decryptedPassword = null;
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }
}

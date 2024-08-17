import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { Epf } from '../epf';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DeletedataComponent } from '../deletedata/deletedata.component';

@Component({
  selector: 'app-epf',
  templateUrl: './epf.component.html',
  styleUrls: ['./epf.component.css']
})
export class EpfComponent implements OnInit {

  collapsed = false;
  searchQuery: string = '';
  isAdmin: boolean = false;
  epfdetails: Epf[] = [];
  selectedEpfId: number | null = null;
  decryptedPassword: string | null = null;
  displayedColumns: string[] = ['estid', 'userid', 'password', 'view', 'edit', 'delete'];
  dataSource = new MatTableDataSource<Epf>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private service: AuthServiceService, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.epfList();
    const data = JSON.parse(localStorage.getItem('adminData'));
    this.isAdmin = data?.role === 'ADMIN';
    this.dataSource.paginator = this.paginator;
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  epfList() {
    const companyId = localStorage.getItem('companyid');
    if (companyId) {
      this.service.getAllEpf(+companyId).subscribe(data => {
        this.epfdetails = data.filter(epf => epf.active); // Ensure only active records
        this.dataSource.data = this.epfdetails;
        this.dataSource.paginator = this.paginator; // Bind paginator
      });
    } else {
      console.error('Company ID is not available in local storage.');
    }
  }

  updateEpf(id: number) {
    this.router.navigate(['/updateepf', id]);
  }

  deleteEpf(id: number): void {
    const dialogRef = this.dialog.open(DeletedataComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteEpf(id).subscribe(
          () => {
            this.epfList(); // Refresh list after deletion
            this.router.navigate(['/epflist']);
          },
          error => console.error(error)
        );
      }
    });
  }

  epfView(id: number) {
    this.router.navigate(['/viewepf', id]);
  }

  getpassword(id: number) {
    this.service.decryptEPF(id).subscribe(
      (data: string) => {
        this.selectedEpfId = id;
        this.decryptedPassword = data;
      },
      error => console.error('Error decrypting password:', error)
    );
  }

  clearDecryptedPassword() {
    this.selectedEpfId = null;
    this.decryptedPassword = null;
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { Esi } from '../esi';
import { MatDialog } from '@angular/material/dialog';
import { DeletedataComponent } from '../deletedata/deletedata.component';

@Component({
  selector: 'app-esi',
  templateUrl: './esi.component.html',
  styleUrls: ['./esi.component.css']
})
export class EsiComponent implements OnInit {

  collapsed = false;
  searchQuery: string = '';
  isAdmin: boolean = false;
  esidetails: Esi[] = [];
  selectedEsiId: number | null = null;
  decryptedPassword: string | null = null;
  displayedColumns: string[] = ['employerCodeNo', 'employerName', 'ro', 'userid', 'password', 'view', 'edit', 'delete'];
  dataSource = new MatTableDataSource<Esi>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private service: AuthServiceService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.esiList();
    const data = JSON.parse(localStorage.getItem('adminData'));
    this.isAdmin = data?.role === 'ADMIN';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  esiList() {
    const companyId = localStorage.getItem('companyid');
    this.service.getAllEsi(+companyId).subscribe(data => {
      this.esidetails = data;
      this.dataSource.data = this.esidetails; // Set the data for the dataSource
    });
  }

  updateEsi(id: number) {
    this.router.navigate(['/updateesi', id]);
  }

  deleteEsi(id: number): void {
    const dialogRef = this.dialog.open(DeletedataComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteEsi(id).subscribe(
          data => {
            console.log(data);
            this.esiList(); 
            this.router.navigate(['/esilist']);
          },
          error => console.log(error)
        );
        console.log(`ESI with ID ${id} deleted.`);
      }
    });
  }

  esiView(id: number) {
    this.router.navigate(['/viewesi', id]);
  }

  getpassword(id: number) {
    this.service.decryptESI(id).subscribe(
      (data: string) => {
        this.selectedEsiId = id;
        this.decryptedPassword = data;
      },
      error => {
        console.error('Error decrypting password:', error);
      }
    );
  }

  clearDecryptedPassword() {
    this.selectedEsiId = null;
    this.decryptedPassword = null;
  }
  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }
}

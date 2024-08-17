import { Component, ViewChild, OnInit } from '@angular/core';
import { Director } from '../director';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { MatDialog } from '@angular/material/dialog';
import { DeletedataComponent } from '../deletedata/deletedata.component';

@Component({
  selector: 'app-director',
  templateUrl: './director.component.html',
  styleUrls: ['./director.component.css']
})
export class DirectorComponent implements OnInit {

  collapsed = false;
  searchQuery: string = '';
  isAdmin: boolean = false;
  directordetails: Director[];
  displayedColumns: string[] = ['name', 'email', 'dinNo', 'view', 'edit', 'delete'];
  dataSource = new MatTableDataSource<Director>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private service: AuthServiceService, private router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadDirectors();
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  loadDirectors() {
    const companyId = localStorage.getItem('companyid');
    this.service.getAllDirector(+companyId).subscribe(data => {
      this.directordetails = data.filter(director => director.active); // Filter active records
      this.dataSource.data = this.directordetails;
      this.dataSource.paginator = this.paginator; // Bind paginator
    });
  }

  updateDirector(id: number) {
    this.router.navigate(['/updatedirectors', id]);
  }

  deleteDirector(id: number): void {
    const dialogRef = this.dialog.open(DeletedataComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteDirector(id).subscribe(
          data => {
            this.loadDirectors(); // Refresh list after deletion
            this.router.navigate(['/directorlist']);
          },
          error => console.error(error)
        );
      }
    });
  }

  directorView(id: number) {
    this.router.navigate(['/viewdirectors', id]);
  }
}

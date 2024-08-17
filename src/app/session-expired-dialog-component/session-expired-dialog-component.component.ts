import { Router } from '@angular/router';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-session-expired-dialog',
   templateUrl: './session-expired-dialog-component.component.html',
   styleUrls: ['./session-expired-dialog-component.component.css']
})
export class SessionExpiredDialogComponentComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
    private dialogRef: MatDialogRef<SessionExpiredDialogComponentComponent>,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.router.url === '/login') {
      this.dialogRef.close();
    }
  }

  onClose(): void {
    this.dialogRef.close();
    this.router.navigate(['/login']);
  }
}

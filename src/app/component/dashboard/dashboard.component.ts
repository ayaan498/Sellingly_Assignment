import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import {FormsModule} from '@angular/forms';

interface BankDetail {
  bankName: string;
  accountNumber: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  bankDetails: BankDetail[] = [];
  bankName: string = '';
  accountNumber: string = '';
  // @Output() isLogout = new EventEmitter<void>();
  constructor(private auth : AuthService) { }
  addBankDetails() {
    const newBankDetail = { bankName: this.bankName, accountNumber: this.accountNumber };
    this.bankDetails.push(newBankDetail);
    this.bankName = '';
    this.accountNumber = '';
  }
  ngOnInit(): void {
    
  }
  removeBankDetails(index: number) {
    this.bankDetails.splice(index, 1);
  }
  logout() {
    this.auth.logout();
  }
}

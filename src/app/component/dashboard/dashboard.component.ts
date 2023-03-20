import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { FormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';

interface BankDetail {
  id?: string;
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

  constructor(private auth: AuthService, private firestore: AngularFirestore) { }

  addBankDetails() {
    const newBankDetail = { bankName: this.bankName, accountNumber: this.accountNumber };
    this.firestore.collection('bankDetails').add(newBankDetail)
      .then((docRef) => {
        console.log('Bank detail added successfully!');
        this.bankDetails.push({ id: docRef.id, ...newBankDetail });
        this.bankName = '';
        this.accountNumber = '';
      })
      .catch((error) => {
        console.error('Error adding bank detail: ', error);
      });   
  }

  ngOnInit() {
    this.firestore.collection<BankDetail>('bank-form').valueChanges().subscribe((data: BankDetail[]) => {
      this.bankDetails = data;
    });
    
  }
  
  
  removeBankDetails(index: number) {
    const docId = this.bankDetails[index].id;
    this.firestore.collection('bankDetails').doc(docId).delete()
      .then(() => {
        console.log('Bank detail deleted successfully!');
        this.bankDetails.splice(index, 1);
      })
      .catch((error) => {
        console.error('Error deleting bank detail: ', error);
      });
  }
  
  logout() {
    this.auth.logout();
  }
}

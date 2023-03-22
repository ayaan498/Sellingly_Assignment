import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { FormsModule } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { v4 as uuidv4 } from 'uuid';

interface BankDetail {
  id: string;
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

  bankDetailsCollection: AngularFirestoreCollection<BankDetail>;

  constructor(private auth: AuthService, private firestore: AngularFirestore) {
    this.bankDetailsCollection = this.firestore.collection<BankDetail>('bankDetails');
  }

  addBankDetails() {
    const newBankDetail: BankDetail = {
      id: uuidv4(),
      bankName: this.bankName,
      accountNumber: this.accountNumber
    };
    
    this.bankDetailsCollection.add(newBankDetail)
      .then((docRef) => {
        console.log('Bank detail added successfully!');
        this.bankDetails.push(newBankDetail);
        this.bankName = '';
        this.accountNumber = '';
      })
      .catch((error) => {
        console.error('Error adding bank detail: ', error);
      });   
  }

  ngOnInit() {
    this.bankDetailsCollection.valueChanges().subscribe((data: BankDetail[]) => {
      this.bankDetails = data;
      console.log(this.bankDetails); // log the bankDetails array to check that it's correct
    });
  }
  
  removeBankDetails(index: number) {
    const accountNumber = this.bankDetails[index].accountNumber;
    this.firestore.collection('bankDetails', ref => ref.where('accountNumber', '==', accountNumber)).get()
      .toPromise()
      .then(snapshot => {
        snapshot.forEach(doc => {
          doc.ref.delete().then(() => {
            console.log('Bank detail deleted successfully!');
            this.bankDetails.splice(index, 1);
          }).catch(error => {
            console.error('Error deleting bank detail: ', error);
          });
        });
      })
      .catch(error => {
        console.error('Error finding bank detail: ', error);
      });
  }
  
  logout() {
    this.auth.logout();
  }
}

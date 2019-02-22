import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Customer} from './customer';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { leftJoin, leftJoinDocument } from '../collectionJoin';
import { docJoin } from '../docJoin';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {

    private dbPath = '/customers';

    // customersRef: AngularFirestoreCollection<Customer> = null;

    constructor(private db: AngularFirestore) {    }

    getCustomersList(sortDirStr, dbMinage, dbMaxage): Observable<any> {
        console.log(sortDirStr);
        return this.db.collection(this.dbPath,
            ref => ref.orderBy('age', sortDirStr).where('age', '>=', dbMinage).where('age', '<=', dbMaxage))
        .snapshotChanges().pipe(
            map(changes =>
                changes.map(c => ({key: c.payload.doc.id, ...c.payload.doc.data()}))
            )
        );
    }

    getJoinedCustomersList(sortDirStr, dbMinage, dbMaxage): Observable<any> {
        console.log(sortDirStr);
        return this.db.collection(this.dbPath,
            ref => ref.orderBy('age', sortDirStr).where('age', '>=', dbMinage).where('age', '<=', dbMaxage))
            .snapshotChanges().pipe(
                leftJoinDocument(this.db, 'cars', 'cars'),
                shareReplay(1)
            );
    }

    /////
    createCustomer(customer: Customer): void {
        this.db.collection(this.dbPath).add({
            'active': customer.active,
            'age': customer.age,
            'name': customer.name
        }).catch(error => this.handleError(error));
    }

    deleteCustomer(id: string): void {
        this.db.doc(`${this.dbPath}/${id}`).delete().catch(error => this.handleError(error));

    }


    getCustomerObj(id): Observable<any> {
        return this.db.doc(`${this.dbPath}/${id}`).valueChanges();
    }

    updateCustomerActive(id: string, active: boolean): void {
        this.db.doc(`${this.dbPath}/${id}`).update({
            'active': active
        }).catch(error => this.handleError(error));
    }

    updateCustomer(id: string, customer: Customer): void {
        this.db.doc(`${this.dbPath}/${id}`).update({
            'active': customer.active,
            'age': customer.age,
            'name': customer.name
        }).catch(error => this.handleError(error));
    }

    private handleError(error) {
        console.log(error);
    }
}

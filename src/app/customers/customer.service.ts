import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Customer} from './customer';
import {Observable} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
import {leftJoinDocument} from '../collectionJoin';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {

    private dbPath = '/customers';

    constructor(private db: AngularFirestore) {
    }

    getJoinedCustomersList(sortDirStr, dbMinage, dbMaxage): Observable<any> {
        return this.db.collection(this.dbPath,
            ref => ref.orderBy('age', sortDirStr).where('age', '>=', dbMinage).where('age', '<=', dbMaxage))
            .valueChanges().pipe(
                leftJoinDocument(this.db, 'car', 'cars'),
                shareReplay(1)
            );
    }

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

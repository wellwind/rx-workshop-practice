import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatCheckboxChange } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  destory = new Subject();
  registerForm: FormGroup;

  regions$: Observable<any>;

  newsletterList = [
    { id: 'subscribeRxWorkshop', name: 'Rx Workshop' },
    { id: 'subscribeAngularMaterial', name: 'Angular Material完全攻略' },
    { id: 'subscribeAngularTutorial', name: 'Angular入門速成班' },
    { id: 'subscribeAngularMaster', name: 'Angular大師養成班' }
  ];

  get checkAll() {
    const subscriptionCount = this._getSubscriptionCount();
    return subscriptionCount === this.newsletterList.length;
  }

  get indeterminateSubscription() {
    const subscriptionCount = this._getSubscriptionCount();
    return subscriptionCount !== 0 && subscriptionCount !== this.newsletterList.length;
  }

  constructor(private httpClient: HttpClient) {
    this.registerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      subscribeAll: new FormControl(),
      subscription: new FormGroup({
        subscribeRxWorkshop: new FormControl(true),
        subscribeAngularMaterial: new FormControl(true),
        subscribeAngularTutorial: new FormControl(true),
        subscribeAngularMaster: new FormControl(false)
      }),
      city: new FormControl(),
      area: new FormControl()
    });
  }

  ngOnInit() {
    this.regions$ = this.httpClient.get<any>('/assets/region.json');
    this.registerForm
      .get('subscribeAll')
      .valueChanges.pipe(tap(value => console.log(value)), takeUntil(this.destory))
      .subscribe(value => {
        this.subscribeAllChange(value);
      });

    this.registerForm
      .get('subscription')
      .valueChanges.pipe(tap(value => console.log(value)), takeUntil(this.destory))
      .subscribe(subscription => {
        this.registerForm.get('subscribeAll').reset(this.checkAll, { emitEvent: false });
      });
  }

  ngOnDestroy() {
    this.destory.next();
    this.destory.complete();
  }

  private _getSubscriptionCount() {
    const subCtrls = (this.registerForm.controls.subscription as FormGroup).controls;
    return Object.keys(subCtrls)
      .filter(key => subCtrls[key].value).length;
  }

  subscribeAllChange(checked: boolean) {
    this.newsletterList.forEach(newsletter => {
      this.registerForm.get(`subscription.${newsletter.id}`).setValue(checked);
    });
  }

  submit() {
    console.log(this.registerForm.value);
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatCheckboxChange } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { tap, map, filter, takeUntil } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;

  destory$ = new Subject();
  regions$: Observable<any>;

  newsletterList = [
    { id: 'subscribeRxWorkshop', name: 'Rx Workshop' },
    { id: 'subscribeAngularMaterial', name: 'Angular Material完全攻略' },
    { id: 'subscribeAngularTutorial', name: 'Angular入門速成班' },
    { id: 'subscribeAngularMaster', name: 'Angular大師養成班' }
  ];

  indeterminateSubscription = false;

  constructor(private httpClient: HttpClient) {
    this.registerForm = new FormGroup({
      name: new FormControl(),
      subscribeAll: new FormControl(),
      subscription: new FormGroup({
        subscribeRxWorkshop: new FormControl(),
        subscribeAngularMaterial: new FormControl(),
        subscribeAngularTutorial: new FormControl(),
        subscribeAngularMaster: new FormControl()
      }),
      city: new FormControl(),
      area: new FormControl()
    });
  }

  ngOnInit() {
    this.regions$ = this.httpClient.get<any>('/assets/region.json');
    this.registerForm
      .get('subscribeAll')
      .valueChanges.pipe(tap(value => console.log(value)), takeUntil(this.destory$))
      .subscribe(value => {
        this.subscribeAllChange(value);
      });

    this.registerForm
      .get('subscription')
      .valueChanges.pipe(
        tap(value => console.log(value)),
        this._countTrue,
        tap(subscriptionCount => {
          console.log(subscriptionCount);
          const checkAll = subscriptionCount === this.newsletterList.length;
          this.indeterminateSubscription = subscriptionCount !== 0 && subscriptionCount !== this.newsletterList.length;
          this.registerForm.get('subscribeAll').setValue(checkAll, { emitEvent: false });
        }),
        map(subscriptionCount => {
          return subscriptionCount >= 2;
        }),
        tap(mustName => {
          this.registerForm.get('name').clearValidators();
          if (mustName) {
            this.registerForm.get('name').setValidators(Validators.required);
          }
          this.registerForm.get('name').updateValueAndValidity();
        }),
        takeUntil(this.destory$)
      )
      .subscribe();

    this.registerForm.reset({
      subscription: {
        subscribeRxWorkshop: true
      }
    });

    this.registerForm.get('name').setValidators(Validators.required);
  }

  ngOnDestroy() {
    this.destory$.next();
    this.destory$.complete();
  }

  private _countTrue(source: Observable<any>): Observable<number> {
    return source.pipe(
      map(data =>  Object.keys(data).filter(key => data[key]).length)
    );
  }

  subscribeAllChange(checked: boolean) {
    this.newsletterList.forEach(newsletter => {
      this.registerForm.get(`subscription.${newsletter.id}`).setValue(checked);
    });
  }

  submit() {
    console.log(this.registerForm.get('name').valid);
    console.log(this.registerForm.value);
  }
}

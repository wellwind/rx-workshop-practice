import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatCheckboxChange } from '@angular/material';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
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
  }

  private _getSubscriptionCount() {
    let subscriptionCount = 0;
    const subscriptionControls = (this.registerForm.controls.subscription as FormGroup).controls;
    Object.keys(subscriptionControls).forEach(contorlKey => {
      subscriptionCount += subscriptionControls[contorlKey].value ? 1 : 0;
    });
    return subscriptionCount;
  }

  subscribeAllChange($event: MatCheckboxChange) {
    this.newsletterList.forEach(newsletter => {
      this.registerForm.get(`subscription.${newsletter.id}`).setValue($event.checked);
    });
  }

  submit() {
    console.log(this.registerForm.value);
  }
}

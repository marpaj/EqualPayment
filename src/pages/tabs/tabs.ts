import { Component } from '@angular/core';

import { PaymentPage } from '../payment/payment';
import { ArticlePage } from '../article/article';
import { SalaryPage } from '../salary/salary';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = SalaryPage;
  tab2Root = ArticlePage;
  tab3Root = PaymentPage;

  constructor() {

  }
}

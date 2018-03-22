import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';

import { PaymentPage } from '../pages/payment/payment';
import { ArticlePage } from '../pages/article/article';
import { ArticleService } from '../pages/article/article.service';
import { SalaryPage } from '../pages/salary/salary';
import { SalaryService } from '../pages/salary/salary.service';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    PaymentPage,
    ArticlePage,
    SalaryPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PaymentPage,
    ArticlePage,
    SalaryPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ArticleService,
    SalaryService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

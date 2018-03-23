import { Component } from '@angular/core';
import {Article} from '../article/article';
import {ArticleService} from '../article/article.service';
import {Salary} from '../salary/salary';
import {SalaryService} from '../salary/salary.service';

@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html'
})

export class PaymentPage {
  /*recurringArticles: Article[];
  notRecurringArticles: Article[];*/
  totalRecurring: number;
  salaries: Salary[];
  recurringPayments: RecurringPayment[];
  notRecurringPayments: NotRecurringPayment[];

  constructor(private artService: ArticleService,
      private salService: SalaryService) {
  }

  ionViewDidEnter() {
    this.salService.getSalaries().then(
      sals => {
        this.salaries = sals;
        return this.artService.getRecurringArticles();
      }

    // Recurring list calculation
    ).then(recurringArticles => {
      this.recurringPayments = [];

      if (recurringArticles == undefined 
          || this.salaries == undefined) {
        return [];

      } else {

        //Calculating total salary
        var salTotal = 0;
        for (let s of this.salaries) {
          salTotal = salTotal + Number(s.salary);
        }

        //Calculating payments by person
        for (let s of this.salaries) {
          var articles: Article[] = [];

          for (let a of recurringArticles) {
            var proportionalPrice:number;
            proportionalPrice = a.price*Number(s.salary)/salTotal;
            articles.push(
              new Article(a.name, Math.round(proportionalPrice*100)/100, true));
          }
          this.recurringPayments.push(
              new RecurringPayment(s.name, articles));
        }
          
        //Calculating recurring total prices
        let total:number =0.0;
        for (let article of recurringArticles) {
          total = total + Number(article.price);
        }
        this.totalRecurring = Math.round(total*100)/100;
        
      }
      return this.artService.getNotRecurringArticles();

    // NOT Recurring list calculation
    }).then(notRecurringArticles => {
      this.notRecurringPayments = [];

      if (notRecurringArticles == undefined 
          || this.salaries == undefined) {
        return [];

      } else {

        //Calculating total salary
        var salTotal = 0;
        for (let s of this.salaries) {
          salTotal = salTotal + Number(s.salary);
        }

        //Calculating payments by article
        for (let a of notRecurringArticles) {
          var payments: string[] = [];

          for (let s of this.salaries) {
            var proportionalPrice:number;
            proportionalPrice = a.price*Number(s.salary)/salTotal;
            payments.push(s.name +": "+ Math.round(proportionalPrice*100)/100 + " euros");
          }
          this.notRecurringPayments.push(
            new NotRecurringPayment(a, payments));
        }
      }
    });
  }
}

export class RecurringPayment {
  personName: string;
  articles: Article[];
  displayArticles: boolean;

  constructor(personName: string, articles: Article[]) {
    this.personName = personName;
    this.articles = articles;
    this.displayArticles = false;
  }

  getTotal(): number {
    let total:number = 0.0;
    for (let article of this.articles) {
      total = total + Number(article.price);
    }
    return Math.round(total*100)/100;
  }

  onChangeDisplayArticle() {
    this.displayArticles = !this.displayArticles;
  }
}

export class NotRecurringPayment {
  article: Article;
  payments: string[];

  constructor(article:Article, payments:string[]) {
    this.article = article;
    this.payments = payments;
  }
}
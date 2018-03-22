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
    recurringArticles: Article[];
    notRecurringArticles: Article[];
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
      ).then(recurringArts => {
        this.recurringArticles = recurringArts;
        this.recurringPayments = [];

        if (this.recurringArticles == undefined 
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
            var total = 0.0;
            var articles: Article[] = [];

            for (let a of this.recurringArticles) {
              var proportionalPrice:number;
              proportionalPrice = a.price*Number(s.salary)/salTotal;
              total = total + proportionalPrice;
              articles.push(
                new Article(a.name, Math.round(proportionalPrice*100)/100, true));
            }
            this.recurringPayments.push(
                new RecurringPayment(s.name, Math.round(total*100)/100, articles));
          }
        }
        return this.artService.getNotRecurringArticles();

      }).then(notRecurringArts => {
        this.notRecurringArticles = notRecurringArts;
        this.notRecurringPayments = [];

        if (this.notRecurringArticles == undefined 
            || this.salaries == undefined) {
          return [];

        } else {

          //Calculating total salary
          var salTotal = 0;
          for (let s of this.salaries) {
            salTotal = salTotal + Number(s.salary);
          }

          //Calculating payments by article
          for (let a of this.notRecurringArticles) {
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

    changeDisplayArticles(personName:string) {
      for (let p of this.recurringPayments) {
        if (p.personName == personName) {
          p.displayArticles = !p.displayArticles;
        }
      }
    }
}

export class RecurringPayment {
  personName: string;
  amount: number;
  articles: Article[];
  displayArticles: boolean;

  constructor(personName: string, amount: number, articles: Article[]) {
    this.personName = personName;
    this.articles = articles;
    this.amount = amount;
    this.displayArticles = false;
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
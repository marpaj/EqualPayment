import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import {ArticleService} from '../article/article.service';

@Component({
  selector: 'page-article',
  templateUrl: 'article.html'
})

export class ArticlePage {
  ADD_ACTION: string = 'ADD';
  EDIT_ACTION: string = 'EDIT';
  LIST_ACTION: string = 'LIST';

  //Erros messages
  ERROR_DUPLICATE='The new article already exists!!';
  ERROR_NUMBER='The article price must be a number.';
  ERROR_MORE_THAN_ZER0='The price must be more than zero.';
  ERROR_NULL_NAME='Name is obligatory.';
  ERROR_NULL_PRICE='Price is obligatory.';
  ERROR_TEMPLATE_OK='Ok';
  ERROR_TEMPLATE_TITLE='Error saving data!';

  name: string;
  price: number;
  recurring: boolean;

  recurringArticles: Article[];
  notRecurringArticles: Article[];
  articleTemp: Article;
  action: string;

  constructor(private service: ArticleService,
      private alertCtrl:AlertController) {
    this.action = this.LIST_ACTION;
    this.initializeArticles();
  }

  initializeArticles() {
    this.recurringArticles = [];
    this.service.getRecurringArticles().then(
      res => {
        if (res != undefined) {
          this.recurringArticles = res;
        }
      }
    );

    this.notRecurringArticles = [];
    this.service.getNotRecurringArticles().then(
      res => {
        if (res != undefined) {
          this.notRecurringArticles = res;
        }
      }
    );
  }

  showAddView() {
    this.action = this.ADD_ACTION;
    this.recurring = false;
  }

  addArticle() {
    if (this.isBasicCheckingValuesOk()) {
      if (this.recurring==true) {
        if (this.isRecurringCheckingOk()) {
          //Saving the new recurring article
          this.recurringArticles.push(
            new Article(this.name, this.price, this.recurring));
          this.service.updateRecurringArticles(this.recurringArticles);    
          this.reset();
          this.action=this.LIST_ACTION;
        }

      } else {
        //Saving the new NOT recurring article
        this.notRecurringArticles.push(
          new Article(this.name, this.price, this.recurring));
        this.service.updateNotRecurringArticles(this.notRecurringArticles);
        this.reset();
        this.action=this.LIST_ACTION;
      }
    }
  }

  showUpdateView(article: Article) {
    this.action = this.EDIT_ACTION;
    this.name = article.name;
    this.price = article.price;
    this.recurring = article.recurring;
    this.articleTemp = article;
  }

  updateArticle() {
    if (this.isBasicCheckingValuesOk()) {
      if (this.articleTemp.recurring != this.recurring) {
        //Recurring input has changed, article will be passed to the other list

        if (this.recurring == false) {
          //Changing the article to NOT recurring list
          this.deleteRecurringArticle(this.articleTemp);
          this.notRecurringArticles.push(
            new Article(this.name, this.price, this.recurring));
        } else {
          //Changing the article to recurring list
          if (this.isRecurringCheckingOk()) {
            this.deleteNotRecurringArticle(this.articleTemp);
            this.recurringArticles.push(
              new Article(this.name, this.price, this.recurring));
          } else {
            return;
          }
        }

      } else {
        if (this.recurring == true 
            && this.articleTemp.name!=this.name 
            && !this.isRecurringCheckingOk()) {
          return;
        } else {
          //Recurring input has not changed
          this.articleTemp.name = this.name;
          this.articleTemp.price = this.price;
          this.articleTemp.recurring = this.recurring;
        }
      }//End IF Recurring


      this.service.updateRecurringArticles(this.recurringArticles);
      this.service.updateNotRecurringArticles(this.notRecurringArticles);
      
      this.reset();
      this.action = this.LIST_ACTION;
    }
  }

  /**
   * Checking input values that are always required
   */
  private isBasicCheckingValuesOk():boolean {
    let isOk:boolean = true;

    //Checking Name input value
    if (this.name==undefined) {
      isOk = false;
      this.displayAlert(this.ERROR_NULL_NAME);

    } else {
      //Checking Price input value
      if (this.price==undefined) {
        isOk = false;
        this.displayAlert(this.ERROR_NULL_PRICE);
      } else if (this.price <= 0) {
        isOk = false;
        this.displayAlert(this.ERROR_MORE_THAN_ZER0);
      }
    }

    return isOk;
  }

  /**
   * Checking if the article already exist
   */
  private isRecurringCheckingOk():boolean {
    let isOk:boolean = true;
    for (var index=0; index<this.recurringArticles.length; index++) {
      if (this.recurringArticles[index].name.toUpperCase() == this.name.toUpperCase()) {
          isOk = false;
          this.displayAlert(this.ERROR_DUPLICATE);
          break;
      }
    }
    return isOk;
  }

  private displayAlert(message:string) {
    let alert = this.alertCtrl.create({
      title:this.ERROR_TEMPLATE_TITLE,
      subTitle:message,
      buttons: [this.ERROR_TEMPLATE_OK]
    });
    alert.present();
  }

  cancelAction() {
    this.action=this.LIST_ACTION;
    this.reset();
  }

  deleteRecurringArticle(article: Article) {
    for (var index=0; index<this.recurringArticles.length; index++) {
      if (this.recurringArticles[index].name == article.name) {
          this.recurringArticles.splice(index, 1);
      }
    }
    this.service.updateRecurringArticles(this.recurringArticles);
  }

  deleteNotRecurringArticle(article: Article) {
    for (var index=0; index<this.notRecurringArticles.length; index++) {
      if (this.notRecurringArticles[index].name == article.name) {
          this.notRecurringArticles.splice(index, 1);
      }
    }
    this.service.updateNotRecurringArticles(this.notRecurringArticles);
  }

  reset() {
    this.name = '';
    this.price = null;
    this.recurring = false;
    this.articleTemp = null;
  }
}

export class Article {
  name: string;
  price: number;
  recurring: boolean;

  constructor(name: string, price: number, recurring:boolean) {
    this.name = name;
    this.price = price;
    this.recurring = recurring;
  }
}
import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Article} from '../article/article';

@Injectable()
export class ArticleService {
  
  KEY_RECURRING: string = 'recurArticles';
  KEY_NOT_RECURRING: string = 'noRecurArticles';

  constructor(private storage: Storage) {}

  getRecurringArticles():Promise<Article[]>{
    return this.storage.get(this.KEY_RECURRING)
      .then(
        res => JSON.parse(res) as Article[]
    );
  }

  getNotRecurringArticles():Promise<Article[]>{
    return this.storage.get(this.KEY_NOT_RECURRING)
      .then(
        res => JSON.parse(res) as Article[]
    );
  }

  updateRecurringArticles(articles:Article[]) {
    this.storage.set(
      this.KEY_RECURRING, JSON.stringify(articles));
  }

  updateNotRecurringArticles(articles:Article[]) {
    this.storage.set(
      this.KEY_NOT_RECURRING, JSON.stringify(articles));
  }

}
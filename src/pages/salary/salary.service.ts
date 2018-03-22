import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Salary} from '../salary/salary';

@Injectable()
export class SalaryService {
  
  KEY_STORAGE: string = 'salaries';

  constructor(private storage: Storage) {}

  getSalaries():Promise<Salary[]>{
    return this.storage.get(this.KEY_STORAGE)
      .then(
       res => JSON.parse(res) as Salary[]
    );
  }

  updateSalaries(salaries:Salary[]) {
    this.storage.set(
      this.KEY_STORAGE, JSON.stringify(salaries));
  }

}
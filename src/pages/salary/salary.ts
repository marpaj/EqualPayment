import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import {SalaryService} from '../salary/salary.service';

@Component({
  selector: 'page-salary',
  templateUrl: 'salary.html'
})

export class SalaryPage {
  
  ADD_ACTION: string = 'ADD';
  EDIT_ACTION: string = 'EDIT';
  LIST_ACTION: string = 'LIST';

  //Erros messages
  ERROR_DUPLICATE='The name of the person already exists!';
  ERROR_NUMBER='The salary must be a number.';
  ERROR_MORE_THAN_ZER0='The salary must be more than zero.';
  ERROR_NAME_OBLIGATORY='Name is obligatory';
  ERROR_SALARY_OBLIGATORY='Salary is obligatory';
  ERROR_TEMPLATE_OK='Ok';
  ERROR_TEMPLATE_TITLE='Error saving data!';

  name: string;
  salary: number;
  salaries: Salary[];
  salaryTemp: Salary;
  action: string;

  constructor(private service: SalaryService,
      private alertCtrl:AlertController) {
    this.action = this.LIST_ACTION;
    this.initializeSalaries();
  }

  initializeSalaries() {
    this.salaries = [];
    this.service.getSalaries().then(
      res => {
        if (res != undefined) {
          this.salaries = res;
        }
      }
    );
  }

  showAddAction() {
    this.action=this.ADD_ACTION;
  }

  addSalary() {
    if (this.isCheckingValuesAndNameDuplicateOk()) {
      this.salaries.push(new Salary(this.name, this.salary));
      this.service.updateSalaries(this.salaries);
      this.reset();
      this.action=this.LIST_ACTION;
    }
  }

  showEditAction(sal: Salary) {
    this.action = this.EDIT_ACTION;
    this.name = sal.name;
    this.salary = sal.salary;
    this.salaryTemp = sal;
  }

  updateSalary() {
    //input name can be changed or not, so checking values depending of the name value
    let isOk:boolean = true;
    if (this.salaryTemp.name == this.name) {
      if (!this.isBasicCheckingValuesOk()) {
        isOk = false;
      }
    } else {
      if (!this.isCheckingValuesAndNameDuplicateOk()) {
        isOk = false;
      }
    }
    
    //Updating salary
    if (isOk) {
      this.salaryTemp.name = this.name;
      this.salaryTemp.salary = this.salary;
      this.service.updateSalaries(this.salaries);
      this.reset();
      this.action = this.LIST_ACTION;
    }
  }

  /**
   * Input value checking that is always required
   */
  private isBasicCheckingValuesOk():boolean {
    let isOk:boolean = true;

    //Checking name isInputValuesOk
    if (this.name==undefined) {
      isOk=false;
      this.displayAlert(this.ERROR_NAME_OBLIGATORY);
      
    } else {
    //Checking price input
      if (this.salary==undefined) {
        isOk=false;
        this.displayAlert(this.ERROR_SALARY_OBLIGATORY);
      } else if (this.salary <= 0) {
        isOk=false;
        this.displayAlert(this.ERROR_MORE_THAN_ZER0);
      }
    }    
    return isOk;
  }

  /**
   * Basic Checking values with another duplicate name case
   */
  private isCheckingValuesAndNameDuplicateOk():boolean {
    let isOk:boolean = true;
    if (this.isBasicCheckingValuesOk()) {
      for (var index=0; index<this.salaries.length; index++) {
        if (this.salaries[index].name.toUpperCase() == this.name.toUpperCase()) {
            isOk = false;
            this.displayAlert(this.ERROR_DUPLICATE);
            break;
        }
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

  deleteSalary(sal: Salary) {
    for (var index=0; index<this.salaries.length; index++) {
      if (this.salaries[index].name == sal.name) {
          this.salaries.splice(index, 1);
      }
    }
    this.service.updateSalaries(this.salaries);
  }

  reset() {
    this.name = '';
    this.salary = null;
    this.salaryTemp = null;
  }
}

export class Salary {
    name: string;
    salary: number;

    constructor(name: string, salary: number) {
        this.name = name;
        this.salary = salary;
    }
}
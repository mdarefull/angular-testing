import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Country, nameOf, NewCompany } from 'shared';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.less']
})
export class CompanyFormComponent implements OnInit {
  @Input() countries: Country[];
  @Input() readonly isAddingCompany: boolean;
  @Input() readonly addCompanyError: string;

  @Output() readonly addNewCompany = new EventEmitter<NewCompany>();

  formGroup: FormGroup;
  nameControl: FormControl;
  emailControl: FormControl;
  countryControl: FormControl;
  marketValueControl: FormControl;

  ngOnInit() {
    this.buildForm();
  }
  private buildForm() {
    this.formGroup = new FormGroup({});

    this.buildNameControl();
    this.buildEmailControl();
    this.buildCountryControl();
    this.buildMarketValueControl();
  }
  private buildNameControl() {
    this.nameControl = new FormControl(null, Validators.required);
    this.formGroup.addControl(nameOf<NewCompany>('name'), this.nameControl);
  }
  private buildEmailControl() {
    this.emailControl = new FormControl(null, [Validators.email]);
    this.formGroup.addControl(nameOf<NewCompany>('email'), this.emailControl);
  }
  private buildCountryControl() {
    this.countryControl = new FormControl(null, Validators.required);
    this.formGroup.addControl(nameOf<NewCompany>('countryId'), this.countryControl);
  }
  private buildMarketValueControl() {
    this.marketValueControl = new FormControl(null, [
      Validators.required,
      Validators.pattern(/^\d+(\.\d{1,2})?$/)
    ]);
    this.formGroup.addControl(nameOf<NewCompany>('marketValue'), this.marketValueControl);
  }

  onFormSubmit(form: NgForm) {
    if (form.valid) {
      const company = this.formGroup.value as NewCompany;
      this.addNewCompany.emit(company);

      form.resetForm();
    }
  }
}

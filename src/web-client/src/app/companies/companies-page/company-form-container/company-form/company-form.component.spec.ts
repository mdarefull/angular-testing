import { Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Country, NewCompany } from 'shared';
import { HostComponentData } from 'shared/test';
import { CompanyFormComponent } from './company-form.component';

/* What could have been done different?
    - Include the SharedModule instead of manually including each dependency
        => SharedModule will grow with the application and we'll end up with a very huge integration test.
        => Once a component is built, usually its dependencies won't change unless its specifications change too.
        => Setting this all up is the main value of the 'creates test' ;)
    - Test when to show the validation error (form submittion, value touched)
        => This depends on the circumstances and specifications.
             The current specification is the default of angular material so it's unpractical to test it.
    - Test form controls directly
        => This could be a good option but:
                - It ties the test to the form implementation.
                - It won't guarantee that what the user input will be tied to the control.
        => In general, we prefer a functional approach, from the user persective: We want an input, we test an input.
    - Be more thorough and test every possibility:
        * If no isAddingComany => don't show spinner.
        * If no addCompanyError => don't show error message.
        * If no input validation error => don't show error message.
        * Better email forma tests.
        => Some cases are over kill while others entierly unpractical (mat-error behavior).
        => BUT: We should have a test for each AC and for each bug found.
    - Not depending on FormControlDirective to set values and states:
        => Manually changing input values would be overkill and cumbersome.
             This is the most practical approach because it's a widely default angular feature.
    - Follow the Single Responsibility Pattern for tests:
        => This is a gray zone.
             Angular component testing is, at some extend, a kind of integration testing and are expensive.
             We will end with hundreds or thousands of tests that could take several minutes to execute.
             On this scenario, it's practical to have several related and expensive tests executed together.
        => Jasmine, by default, won't stop on first failure, so it will report most errors on test run.
*/

// We use a Test Host Component to properly test angular features (@Input/@Output, etc...)
@Component({
  template: `
    <app-company-form
      [countries]="countries"
      [isAddingCompany]="isAddingCompany"
      [addCompanyError]="addCompanyError"
    >
    </app-company-form>
  `
})
class TestHostComponent {
  countries: Country[];
  isAddingCompany: boolean;
  addCompanyError: string;
}

// Implements the Page Model pattern to provide easy access to the form page elements.
class CompanyFormData extends HostComponentData<TestHostComponent, CompanyFormComponent> {
  get header() {
    return this.queryNative('h1') as HTMLHeadingElement;
  }

  get spinner() {
    return this.queryNative('mat-progress-spinner');
  }

  get addErrorMsg() {
    return this.queryNative('#add-company-error-message');
  }

  get formGroup() {
    return this.queryGroup('form');
  }

  get nameInput() {
    return this.queryNative('#name-input') as HTMLInputElement;
  }
  get nameControl() {
    return this.queryControl('#name-input');
  }
  get nameInputError() {
    return this.queryNative('#name-input-error');
  }

  get emailInput() {
    return this.queryNative('#email-input') as HTMLInputElement;
  }
  get emailControl() {
    return this.queryControl('#email-input');
  }
  get emailInputError() {
    return this.queryNative('#email-input-error');
  }

  get countriesSelect() {
    return this.queryNative('#countries-select') as HTMLInputElement;
  }
  get countriesMatSelect() {
    return this.queryChild(MatSelect);
  }
  get countriesControl() {
    return this.countriesMatSelect.ngControl.control;
  }
  get countriesSelectError() {
    return this.queryNative('#countries-select-error');
  }

  get marketValueInput() {
    return this.queryNative('#market-value-input') as HTMLInputElement;
  }
  get marketValueControl() {
    return this.queryControl('#market-value-input');
  }
  get marketValueInputError() {
    return this.queryNative('#market-value-input-error');
  }

  get submitBtn() {
    return this.queryNative('button[type="submit"]') as HTMLButtonElement;
  }
}

describe(CompanyFormComponent.name, () => {
  let testData: CompanyFormData;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule
      ],
      declarations: [CompanyFormComponent, TestHostComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    testData = new CompanyFormData(TestHostComponent, CompanyFormComponent);
  });

  it('creates', () => {
    // Assert
    testData.assertWasCreated();
  });

  it('renders header', () => {
    // Arrange
    const header = testData.header;

    // Assert
    expect(header).toBeTruthy();
    expect(header.textContent).toBe('New Company');
  });

  it('shows spinner if isAddingCompany', () => {
    // Act
    testData.component.isAddingCompany = true;
    testData.detectChanges();

    const spinner = testData.spinner;

    // Assert
    expect(spinner).toBeTruthy();

    // These are optional. Test only if they are part of the ACs. Included only as reference
    const color = spinner.attributes.getNamedItem('ng-reflect-color');
    expect(color.value).toBe('primary');

    const mode = spinner.attributes.getNamedItem('ng-reflect-mode');
    expect(mode.value).toBe('indeterminate');
  });

  it('shows error when addCompanyError', () => {
    // Act
    testData.component.addCompanyError = 'some error';
    testData.detectChanges();

    const addCompanyError = testData.addErrorMsg;

    // Assert
    expect(addCompanyError).toBeTruthy();
    expect(addCompanyError.textContent).toBe(testData.component.addCompanyError);
  });

  it('renders name input', () => {
    // Arrange
    const nameInput = testData.nameInput;

    // Assert
    expect(nameInput).toBeTruthy();
    expect(nameInput.placeholder).toBe('Name');
    expect(nameInput.required).toBeTruthy();
  });

  it('name input is required', () => {
    // Assert
    testData.assertRequired(testData.nameControl);
  });

  it('renders name input validation error', () => {
    // Act
    testData.touch(testData.nameControl);
    const nameError = testData.nameInputError;

    // Assert
    expect(nameError).toBeTruthy();
    expect(nameError.textContent).toBe('Enter a valid Name');
  });

  it('renders email input', () => {
    // Arrange
    const emailInput = testData.emailInput;

    // Assert
    expect(emailInput).toBeTruthy();
    expect(emailInput.type).toBe('email');
    expect(emailInput.placeholder).toBe('Email');
  });

  it('email input must have valid email format', () => {
    // Arrange
    const emailControl = testData.emailControl;

    // Act
    testData.setValue(emailControl, 'this is not an email');

    // Assert
    expect(emailControl.invalid).toBeTruthy();
  });

  it('renders email input validation error', () => {
    // Act
    testData.setValue(testData.emailControl, 'this is not an email');

    const emailError = testData.emailInputError;

    // Assert
    expect(emailError).toBeTruthy();
    expect(emailError.textContent).toBe('Enter a valid Email');
  });

  it('renders countries select with application countries', () => {
    // Arrange
    const countries = [
      { id: 1, name: 'C1' },
      { id: 2, name: 'C2' },
      { id: 3, name: 'C3' }
    ] as Country[];
    testData.component.countries = countries;
    testData.detectChanges();

    const countriesSelect = testData.countriesMatSelect;
    const options = countriesSelect.options.toArray();

    // Assert
    expect(countriesSelect).toBeTruthy();
    expect(countriesSelect.placeholder).toBe('Country');
    expect(countriesSelect.required).toBeTruthy();

    expect(options.length).toBe(countries.length);
    for (let i = 0; i < countries.length; i++) {
      const country = countries[i];
      const option = options[i];

      expect(option.value).toBe(country.id);
      expect(option.viewValue).toBe(country.name);
    }
  });

  it('countries select is required', () => {
    // Assert
    testData.assertRequired(testData.countriesControl);
  });

  it('if countries select is invalid, will render validation error', () => {
    // Act
    testData.touch(testData.countriesControl);

    const countriesError = testData.countriesSelectError;

    // Assert
    expect(countriesError).toBeTruthy();
    expect(countriesError.textContent).toBe('Select a Country');
  });

  it('renders market value input', () => {
    // Arrange
    const marketInput = testData.marketValueInput;

    // Assert
    expect(marketInput).toBeTruthy();
    expect(marketInput.placeholder).toBe('Market Value');
    expect(marketInput.required).toBeTruthy();
  });

  it('market value input is required', () => {
    // Assert
    testData.assertRequired(testData.marketValueControl);
  });

  it('market value input must be decimal', () => {
    // Arrange
    const marketControl = testData.marketValueControl;

    // Act
    testData.setValue(marketControl, 'not decimal value');

    // Assert
    expect(marketControl.invalid).toBeTruthy();
  });

  it('if market value is invalid, will render validation error', () => {
    // Act
    testData.touch(testData.marketValueControl);

    const marketInputError = testData.marketValueInputError;

    // Assert
    expect(marketInputError).toBeTruthy();
    expect(marketInputError.textContent).toBe('Enter a valid Market Value');
  });

  it('renders submit button', () => {
    // Arrange
    const submitBtn = testData.submitBtn;

    // Assert
    expect(submitBtn).toBeTruthy();
    expect(submitBtn.textContent).toBe('Add');
  });

  it('if invalid form submitted, will not emit addNewCompany', () => {
    // Arrange
    let emitted = false;
    testData.hostedComponent.addNewCompany.subscribe(() => (emitted = true));

    // Act
    testData.submitBtn.click();

    // Assert
    expect(emitted).toBeFalsy();
  });

  it('if valid form submitted, will emit addNewCompany and reset form', () => {
    // Arrange
    const newCompany: NewCompany = {
      countryId: 2,
      email: 'test@example.com',
      marketValue: 34.78,
      name: 'some name'
    };
    testData.component.countries = [
      { id: 1, name: 'US' },
      { id: 2, name: 'Canada' },
      { id: 3, name: 'UK' }
    ];
    testData.detectChanges();

    testData.setValue(testData.nameControl, newCompany.name);
    testData.setValue(testData.emailControl, newCompany.email);
    testData.setValue(testData.countriesControl, newCompany.countryId);
    testData.setValue(testData.marketValueControl, newCompany.marketValue);

    let emittedCompany: NewCompany;
    testData.hostedComponent.addNewCompany.subscribe((c: NewCompany) => (emittedCompany = c));
    const resetSpy = spyOn(testData.formGroup, 'reset');

    // Act
    testData.submitBtn.click();
    testData.detectChanges();

    // Assert
    expect(emittedCompany).toEqual(newCompany);
    expect(resetSpy).toHaveBeenCalledTimes(1);
  });
});

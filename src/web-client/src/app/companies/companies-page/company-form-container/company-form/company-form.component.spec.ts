import { Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Country } from 'shared';
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

    - Create a unique @Input() parameter with all the data:
        => This reduces the isolation of a test, making each harder to maintain.
    - Not tying to angular material components:
        => We are using angular material so there are some strict rules to follow.
             Selecting elements by its type (<mat-card-title>) directly it's the most practical approach.
    - Test the template layout better:
        * it renders a <mat-card>
        * better select each element: mat-card-title is the second child inside mat-card-header
        => These are not strictly functional specifications and testing it would tight the tests more to the implementation.
             The app would have been more robust but more rigid too (harder to refactor).
    - Unit tests with pipes involved:
        => Whenever we use a pipe, there's no way to create the purest unit test. This is the most practical approach.
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

fdescribe(CompanyFormComponent.name, () => {
  let testData: HostComponentData<TestHostComponent, CompanyFormComponent>;

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
    testData = new HostComponentData(TestHostComponent, CompanyFormComponent);
  });

  it('creates', () => {
    // Assert
    testData.assertWasCreated();
  });

  it('renders header', () => {
    // Arrange
    const header = testData.nativeElement.querySelector('h1');

    // Assert
    expect(header).toBeTruthy();
    expect(header.textContent).toBe('New Company');
  });

  it('shows spinner if isAddingCompany', () => {
    // Act
    testData.component.isAddingCompany = true;
    testData.detectChanges();

    const spinner = testData.nativeElement.querySelector('mat-progress-spinner');

    // Assert
    expect(spinner).toBeTruthy();

    // These are optional. Test only if they are part of the ACs.
    const color = spinner.attributes.getNamedItem('ng-reflect-color');
    expect(color.value).toBe('primary');

    const mode = spinner.attributes.getNamedItem('ng-reflect-mode');
    expect(mode.value).toBe('indeterminate');
  });

  it('shows error when addCompanyError', () => {
    // Act
    testData.component.addCompanyError = 'some error';
    testData.detectChanges();
    const errorSpan = testData.nativeElement.querySelector('#add-company-error-message');

    // Assert
    expect(errorSpan.textContent).toBe(testData.component.addCompanyError);
  });

  it('renders name input', () => {
    // Arrange
    const nameInput = testData.nativeElement.querySelector('#name-input') as HTMLInputElement;

    // Assert
    expect(nameInput).toBeTruthy();
    expect(nameInput.placeholder).toBe('Name');
    expect(nameInput.required).toBeTruthy();
  });

  it('name input is required', () => {
    // Arrange
    const nameInput = testData.nativeElement.querySelector('#name-input') as HTMLInputElement;

    // Assert
    const isInvalid = nameInput.classList.contains('ng-invalid');
    expect(isInvalid).toBeTruthy();
  });

  it('renders name input validation error', () => {
    // Arrange
    const nameInput = testData.nativeElement.querySelector('#name-input') as HTMLInputElement;

    // Act
    nameInput.dispatchEvent(new Event('focus'));
    nameInput.dispatchEvent(new Event('blur'));
    testData.detectChanges();

    const nameError = testData.nativeElement.querySelector('#name-input-error');

    // Assert
    expect(nameError).toBeTruthy();
    expect(nameError.textContent).toBe('Enter a valid Name');
  });

  it('renders email input', () => {
    // Arrange
    const emailInput = testData.nativeElement.querySelector('#email-input') as HTMLInputElement;

    // Assert
    expect(emailInput).toBeTruthy();
    expect(emailInput.type).toBe('email');
    expect(emailInput.placeholder).toBe('Email');
  });

  it('email input must have valid email format', () => {
    // Arrange
    const emailInput = testData.nativeElement.querySelector('#email-input') as HTMLInputElement;

    // Act
    emailInput.value = 'this is not an email';
    emailInput.dispatchEvent(new Event('input'));
    testData.detectChanges();

    // Assert
    const isInvalid = emailInput.classList.contains('ng-invalid');
    expect(isInvalid).toBeTruthy();
  });

  it('renders email input validation error', () => {
    // Arrange
    const emailInput = testData.nativeElement.querySelector('#email-input') as HTMLInputElement;

    // Act
    emailInput.value = 'invalid email';
    emailInput.dispatchEvent(new Event('input'));
    emailInput.dispatchEvent(new Event('focus'));
    emailInput.dispatchEvent(new Event('blur'));
    testData.detectChanges();

    const emailError = testData.nativeElement.querySelector('#email-input-error');

    // Assert
    expect(emailError).toBeTruthy();
    expect(emailError.textContent).toBe('Enter a valid Email');
  });

  it('renders country select', () => {
    // Arrange
    const countrySelect = testData.getChild(MatSelect);

    // Assert
    expect(countrySelect).toBeTruthy();
    expect(countrySelect.placeholder).toBe('Country');
    expect(countrySelect.required).toBeTruthy();
  });

  it('renders country select with input countries', () => {
    // Arrange
    const countrySelect = testData.getChild(MatSelect);
    const countries = [
      { id: 1, name: 'C1' },
      { id: 2, name: 'C2' },
      { id: 3, name: 'C3' }
    ] as Country[];

    // Act
    testData.component.countries = countries;
    testData.detectChanges();
    const options = countrySelect.options.toArray();

    // Assert
    expect(options.length).toBe(countries.length);
    for (let i = 0; i < countries.length; i++) {
      const country = countries[i];
      const option = options[i];

      expect(option.value).toBe(country.id);
      expect(option.viewValue).toBe(country.name);
    }
  });

  it('country select is required', () => {
    // Arrange
    const countrySelect = testData.nativeElement.querySelector('#country-select');

    // Assert
    const isInvalid = countrySelect.classList.contains('ng-invalid');
    expect(isInvalid).toBeTruthy();
  });

  it('renders country select validation error', () => {
    // Arrange
    const countrySelect = testData.nativeElement.querySelector('#country-select');

    // Act
    countrySelect.dispatchEvent(new Event('focus'));
    countrySelect.dispatchEvent(new Event('blur'));
    testData.detectChanges();

    const countriesError = testData.nativeElement.querySelector('#country-select-error');

    // Assert
    expect(countriesError).toBeTruthy();
    expect(countriesError.textContent).toBe('Select a Country');
  });

  it('renders market value input', () => {
    // Arrange
    const marketInput = testData.nativeElement.querySelector(
      '#market-value-input'
    ) as HTMLInputElement;

    // Assert
    expect(marketInput).toBeTruthy();
    expect(marketInput.placeholder).toBe('Market Value');
    expect(marketInput.required).toBeTruthy();
  });

  it('market value input is required', () => {
    // Arrange
    const marketInput = testData.nativeElement.querySelector(
      '#market-value-input'
    ) as HTMLInputElement;

    // Assert
    const isInvalid = marketInput.classList.contains('ng-invalid');
    expect(isInvalid);
  });

  it('market value input must be decimal', () => {
    // Arrange
    const marketInput = testData.nativeElement.querySelector(
      '#market-value-input'
    ) as HTMLInputElement;

    // Act
    marketInput.value = 'not decimal value';
    marketInput.dispatchEvent(new Event('input'));
    testData.detectChanges();

    // Assert
    const isInvalid = marketInput.classList.contains('ng-invalid');
    expect(isInvalid);
  });

  it('renders market value input validation error', () => {
    // Arrange
    const marketInput = testData.nativeElement.querySelector(
      '#market-value-input'
    ) as HTMLInputElement;

    // Act
    marketInput.dispatchEvent(new Event('focus'));
    marketInput.dispatchEvent(new Event('blur'));
    testData.detectChanges();

    const marketInputError = testData.nativeElement.querySelector('#market-value-input-error');

    // Assert
    expect(marketInputError).toBeTruthy();
    expect(marketInputError.textContent).toBe('Enter a valid Market Value');
  });

  it('renders submit button', () => {
    // Arrange
    const submitBtn = testData.nativeElement.querySelector('button[type="submit"]');
    debugger;
    // Assert
  });

  it('emit addNewCompany if valid form submitted', () => {
    // Assert
  });

  it('does not emit addNewCompany if invalid form submitted', () => {
    // Assert
  });

  it('reset form when submitted', () => {
    // Assert
  });
});

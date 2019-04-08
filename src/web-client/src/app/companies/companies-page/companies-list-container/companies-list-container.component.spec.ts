import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesListContainerComponent } from './companies-list-container.component';

describe('CompaniesListContainerComponent', () => {
  let component: CompaniesListContainerComponent;
  let fixture: ComponentFixture<CompaniesListContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompaniesListContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

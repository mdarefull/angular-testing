import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyFormContainerComponent } from './company-form-container.component';

describe('CompanyFormContainerComponent', () => {
  let component: CompanyFormContainerComponent;
  let fixture: ComponentFixture<CompanyFormContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyFormContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyFormContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

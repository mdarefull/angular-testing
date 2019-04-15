import { DebugElement, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormControlDirective, FormGroupDirective } from '@angular/forms';
import { By } from '@angular/platform-browser';

export class ComponentData<TComponent> {
  fixture: ComponentFixture<TComponent>;
  debugElement: DebugElement;
  nativeElement: Element;
  component: TComponent;

  constructor(componentType: Type<TComponent>, initialize = true) {
    this.fixture = TestBed.createComponent(componentType);
    this.component = this.fixture.componentInstance;
    this.debugElement = this.fixture.debugElement;
    this.nativeElement = this.fixture.nativeElement;

    if (initialize) {
      this.detectChanges();
    }
  }

  getDependency<TDependency>(token: Type<TDependency>) {
    return TestBed.get(token) as TDependency;
  }

  query(selector: string) {
    return this.debugElement.query(By.css(selector));
  }
  queryNative(selector: string) {
    return this.query(selector).nativeElement as HTMLElement;
  }
  queryChild<TChildDirective>(directive: Type<TChildDirective>): TChildDirective {
    return this.debugElement.query(By.directive(directive)).componentInstance as TChildDirective;
  }
  queryControl(selector: string) {
    return this.query(selector).injector.get(FormControlDirective).control;
  }
  queryGroup(selector: string) {
    return this.query(selector).injector.get(FormGroupDirective).control;
  }

  queryAll(selector: string) {
    return this.debugElement.queryAll(By.css(selector));
  }
  queryAllNative(selector: string) {
    return this.queryAll(selector).map(d => d.nativeElement as HTMLElement);
  }
  queryChildren<TChildDirective>(directive: Type<TChildDirective>): TChildDirective[] {
    return this.debugElement
      .queryAll(By.directive(directive))
      .map(d => d.componentInstance as TChildDirective);
  }
  queryControls(selector: string) {
    return this.queryAll(selector).map(d => d.injector.get(FormControlDirective).control);
  }
  queryGroups(selector: string) {
    return this.queryAll(selector).map(d => d.injector.get(FormGroupDirective).control);
  }

  setValue(control: AbstractControl, value: any) {
    control.setValue(value);
    control.markAsTouched();
    control.markAsDirty();
    control.updateValueAndValidity();

    this.detectChanges();
  }

  touch(control: AbstractControl) {
    control.markAsTouched();
    this.detectChanges();
  }

  detectChanges() {
    this.fixture.detectChanges();
  }

  assertWasCreated() {
    expect(this.component).toBeTruthy();
  }

  assertHasChild<TChildDirective>(directive: Type<TChildDirective>) {
    const child = this.queryChild(directive);
    expect(child).toBeTruthy();
  }

  assertRequired(control: AbstractControl) {
    this.setValue(control, null);

    expect(control.errors).toBeTruthy();
    expect(control.errors.required).toBeTruthy();
  }
}

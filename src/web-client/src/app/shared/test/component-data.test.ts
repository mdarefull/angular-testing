import { DebugElement, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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

  getChild<TChildDirective>(directive: Type<TChildDirective>): TChildDirective {
    return this.debugElement.query(By.directive(directive)).componentInstance as TChildDirective;
  }

  getChildren<TChildDirective>(directive: Type<TChildDirective>): TChildDirective[] {
    return this.debugElement
      .queryAll(By.directive(directive))
      .map(d => d.componentInstance as TChildDirective);
  }

  detectChanges() {
    this.fixture.detectChanges();
  }

  assertWasCreated() {
    expect(this.component).toBeTruthy();
  }

  assertHasChild<TChildDirective>(directive: Type<TChildDirective>) {
    const child = this.debugElement.query(By.directive(directive))
      .componentInstance as TChildDirective;

    expect(child).toBeTruthy();
  }
}

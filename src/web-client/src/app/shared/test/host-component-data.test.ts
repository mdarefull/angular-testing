import { Type } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentData } from './component-data.test';

export class HostComponentData<THost, TComponent> extends ComponentData<THost> {
  hostedComponent: TComponent;

  constructor(hostType: Type<THost>, componentType: Type<TComponent>, initialize = true) {
    super(hostType, initialize);

    this.debugElement = this.debugElement.query(By.directive(componentType));
    this.nativeElement = this.debugElement.nativeElement;
    this.hostedComponent = this.debugElement.componentInstance;
  }

  assertWasCreated() {
    expect(this.hostedComponent).toBeTruthy();
  }
}

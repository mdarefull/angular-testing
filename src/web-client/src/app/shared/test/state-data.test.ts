import { TestBed } from '@angular/core/testing';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

export class StateData<TModel> {
  stateName: string;
  store: Store;

  get state() {
    return this.store.selectSnapshot(state => state[this.stateName] as TModel);
  }

  constructor(stateName: string) {
    this.stateName = stateName;
    this.store = TestBed.get(Store) as Store;
  }

  dispatch(event: any | any[]): Observable<any> {
    return this.store.dispatch(event);
  }

  setState(model: TModel) {
    const state = {};
    state[this.stateName] = model;
    this.store.reset(state);
  }
}

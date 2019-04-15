import { Store } from '@ngxs/store';
import { TestBed } from '@angular/core/testing';

export class StoreData<TModel> {
  stateName: string;
  store: Store;
  dispatchSpy: jasmine.Spy;

  constructor(stateName: string) {
    this.stateName = stateName;
    this.store = TestBed.get(Store) as Store;
    this.dispatchSpy = spyOn(this.store, 'dispatch');
  }

  getSpy(method: keyof Store): jasmine.Spy {
    return this.store[method] as jasmine.Spy;
  }

  assertActionsDispatched(...actions: Object[]) {
    expect(this.dispatchSpy.calls.count()).toBe(actions.length);

    const args = this.dispatchSpy.calls.allArgs();
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      const dispatchedAction = args[i][0];

      expect(dispatchedAction).toEqual(action);
    }
  }

  resetState(model: TModel) {
    const state = {};
    state[this.stateName] = model;

    this.store.reset(state);
  }
}

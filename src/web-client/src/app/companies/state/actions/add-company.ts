import { NewCompany } from 'shared';

export class AddCompany {
  static readonly type = '[Companies] - Add Company';

  constructor(public readonly newCompany: NewCompany) {}
}

import { GenericFormField } from './generic-form-field';

export class TableColumns {
  name: string;
  key?: string;
  isAction?: boolean;
  actions?: any[];
  type?: GenericFormField;
  notShow?: boolean;
  filtrable?: boolean;
}

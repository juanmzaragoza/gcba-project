import { ValidatorFn } from '@angular/forms';

export class GenericFormField {
  title: string; // label
  name: string; // correspondiente al identificador y al fiel de los values

  offsetLeft?: string;
  size?: string; // span-6: tamaño de grilla en material
  offsetRight?: string;

  hidden?: boolean; // si el campo aparece oculto o no
  disabled?: boolean; // si el campo esta deshabilitado
  type: 'text' | 'number' | 'checkbox' | 'select' | 'textarea' | 'date' | 'autocomplete' | 'submit' | 'button'; //todo weitere
  validators?: Array<ValidatorFn>;
  lookups?: Array<Lookup>;//fuer type == select
  execute?: any;

  checked?: boolean;  // type == checkbox
  required?: boolean; // type == checkbox

  mask?: Array<any>; // type == input

  apiSearch?: Function; // type == autocomplete -> llamada a servicio que popula
  getFormattedResult?: Function; // type == autocomplete -> llamada a servicio que renderea el resultado

  color?: string; // type == submit
}

export class Lookup {
  key: string;
  value: string;
  selected?: boolean;
}

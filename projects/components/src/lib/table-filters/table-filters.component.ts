import {Component, EventEmitter, OnInit, Input, Output} from '@angular/core';

import { GenericFormField } from '../models/generic-form-field';

@Component({
  selector: 'lib-table-filters',
  templateUrl: './table-filters.component.html',
  styleUrls: ['./table-filters.component.scss']
})
export class TableFiltersComponent implements OnInit {

  @Output() submitFilter: EventEmitter<any> = new EventEmitter<any>();
  @Input() fields: GenericFormField[];

  // entrada que indica que el botón se encuentra cargando
  @Input() loading: boolean;

  cuilmask = [/\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/];

  values: any;

  constructor() { }

  ngOnInit() {
  }

  change(event) {
    this.values = event;
  }

  submit(event) {
    this.submitFilter.emit(this.values);
  }

}

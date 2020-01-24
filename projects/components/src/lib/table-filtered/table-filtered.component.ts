import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ContentChild, TemplateRef, SimpleChanges, OnChanges } from '@angular/core';

import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import {animate, state, style, transition, trigger} from '@angular/animations';

import { GenericFormField } from '../models/generic-form-field';
import { TableColumns } from '../models/table-columns';
import { ConfigPagination } from '../models/config-pagination';

import _ from 'lodash';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'lib-table-filtered',
  templateUrl: './table-filtered.component.html',
  styleUrls: ['./table-filtered.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TableFilteredComponent implements OnInit, OnChanges {

  @Output() update: EventEmitter<any> = new EventEmitter<any>();

  @Input() displayedColumns: TableColumns[] = [
    {name: 'position', key: 'position'},
    {name: 'name', key: 'name'},
    {name: 'weight', key: 'weight'},
    {name: 'symbol', key: 'symbol'}
  ];
  _displayedColumns: string[];

  @Input() data: any[];
  get displayedData(): any[] {
    // transform value for display
    return this.data;
  }
  @Input()
  set displayedData(displayedData: any[]) {
    this.data = displayedData;
    this.dataSource = new MatTableDataSource(this.data ? this.data : ELEMENT_DATA);
    this.dataSource.sort = this.sort;
  }

  /*
   * Si es true, muestra los filtros de búsqueda
   */
  @Input() showFilters = false;
  /*
   * Campos de los diferentes filtros
   */
  @Input() filterFields: GenericFormField[];
  /*
   * entrada que cuando los filtros estan activos, renderea botones al lado del submit
   */
  @Input() extraFilterButtons: GenericFormField[];
  /*
   * Se ejecuta cuando se ingresa algún dato a los filtros
   */
  @Output() onChangeFilter: EventEmitter<any> = new EventEmitter<any>();
  /*
   * entrada que indica que el botón se encuentra cargando
   */
  @Input() filterLoading: boolean;
  /*
   * Si es true, entonces las filas se podrán clickear y dispararán en elevento onSelectRow
   */
  @Input() isRowClickable = false;
  /*
   * Se ejecuta cuando se clickea una fila del resultado
   */
  @Output() selectRow: EventEmitter<any> = new EventEmitter<any>();
  /*
   * Paginación
   */
  @Input() configPagination: ConfigPagination;
  /*
   * Se ejecuta cuando se cambia el paginado
   */
  @Output() onChangePage: EventEmitter<any> = new EventEmitter<any>();
  /*
   * Valido si es una acción o una columna normal
   */
  @Input() expandable = false;
  /*
   * Para atajar evento de click row en las acciones
   */
  expansion = false;
  /*
   * Se ejecuta cuando se expande la fila
   */
  @Output() expandRow: EventEmitter<any> = new EventEmitter<any>();
  /*
   * Permite clickear y expandir la fila presionando en cualquier espacio de la misma
   */
  @Input() rowClickable = true;
  /*
   * Cierra el expandible cuando pasa de false a true
   */
  @Input() closeExpandable = false;

  @ContentChild(TemplateRef, {static: true}) templateRef: TemplateRef<any>;

  expandedElement: any;

  dataSource: MatTableDataSource<TableColumns>;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  lodash = _;

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.data ? this.data : ELEMENT_DATA);
    this.dataSource.sort = this.sort;

    this._displayedColumns = this.displayedColumns ?
      _.map(
        _.filter(this.displayedColumns, (colF) => {
          return !colF.notShow;
        }),
        (col) => {
          return col.key;
        })
      :
      ['position', 'name', 'weight', 'symbol'];

    if (this.showFilters) {
      // armo campos para filtros
      this.filterFields = _.map(_.filter(this.displayedColumns, (f) => {
        return f.filtrable;
      }), (o) => {
        return o.type;
      });
      this.filterFields.push({name: 'submit', type: 'submit', title: 'Buscar', size: 'span-1'});
      if (this.extraFilterButtons && this.extraFilterButtons.length) {
        this.filterFields = this.filterFields.concat(this.extraFilterButtons);
      }
    }

  }

  filterChange(event) {
    this.onChangeFilter.emit(event);
  }

  /**
   * Se dispara cuando se da click al encabezado de una columna para ordenarla.
   * @param event objeto con el nombre de la columna y el orden
   */
  sortChange(event) {
    //console.log(event);
  }

  onSelectRow(row) {
    this.selectRow.emit(row);
  }

  changePage(event) {
    this.onChangePage.emit(event);
  }
  /*
   * Cuando se ejecuta una accion a la derecha de la tabla
   */
  onClickAction(event, action, element) {
    this.expansion = true;
    action.execute ? action.execute(element) : null;
  }
  /*
   * Se ejecuta al clikear la fila
   * Valida que no sea una columna accion
   * En las acciones no expande !!!
   */
  onClickRow(event, row) {
    // busco alguno con el id == expander para ver si es un ampliador de contenido
    const path = event.path || event.composedPath();
    const expander = _.filter(path, (el) => {
      return el.id === 'expander';
    });
    /*
     * valido que sea una columna no accion
     * o que la accion sea de expandir y expandio
     */
    if (this.expandable && (!this.expansion || expander.length)) {
      this.expandedElement = this.expandedElement === row || (!expander.length && this.rowClickable) ? null : row;
      if (this.expandedElement) {
        this.expandRow.emit(this.expandedElement);
      }
    }
    // si la columna era accion -> reseteo expansion
    if(this.expansion) {
      this.expansion = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // cuando closeExpandible == true -> cierro
    if (changes && changes.closeExpandible
      && changes.closeExpandible.currentValue !== changes.closeExpandible.previousValue
      && changes.closeExpandible.currentValue) {
      this.expandedElement = null;
      this.expansion = false;
    }
  }

}


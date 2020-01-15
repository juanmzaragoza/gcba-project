import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ContentChild, TemplateRef, SimpleChanges } from '@angular/core';

import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import {animate, state, style, transition, trigger} from '@angular/animations';

import { GenericFormField } from '../models/generic-form-field';
import { TableColumns } from '../models/table-columns';

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
  selector: 'app-table-filtered',
  templateUrl: './table-filtered.component.html',
  styleUrls: ['./table-filtered.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TableFilteredComponent implements OnInit {

  @Output() onUpdate: EventEmitter<any> = new EventEmitter<any>();

  @Input() displayedColumns: TableColumns[] = [
    {name: 'position',key: 'position'},
    {name: 'name',key: 'name'},
    {name: 'weight', key: 'weight'},
    {name: 'symbol', key: 'symbol'}
  ];
  _displayedColumns: string[];

  @Input() _displayedData: any[];
  get displayedData(): any[] {
    // transform value for display
    return this._displayedData;
  }
  @Input()
  set displayedData(displayedData: any[]) {
    this._displayedData = displayedData;
    this.dataSource = new MatTableDataSource(this._displayedData? this._displayedData:ELEMENT_DATA);
    this.dataSource.sort = this.sort;
  }

  /*
   * Si es true, muestra los filtros de búsqueda
   */
  @Input('showFilters') showFilters: boolean = false;
  /*
   * Campos de los diferentes filtros
   */
  @Input('filterFields') filterFields: GenericFormField[];
  /*
   * entrada que cuando los filtros estan activos, renderea botones al lado del submit
   */
  @Input('extraFilterButtons') extraFilterButtons: GenericFormField[];
  /*
   * Se ejecuta cuando se ingresa algún dato a los filtros
   */
  @Output() onChangeFilter: EventEmitter<any> = new EventEmitter<any>();
  /*
   * entrada que indica que el botón se encuentra cargando
   */
  @Input('filterLoading') filterLoading: boolean;
  /*
   * Si es true, entonces las filas se podrán clickear y dispararán en elevento onSelectRow
   */
  @Input('isRowClickeable') isRowClickeable: boolean = false;
  /*
   * Se ejecuta cuando se clickea una fila del resultado
   */
  @Output() onSelectRow: EventEmitter<any> = new EventEmitter<any>();
  /*
   * Paginación
   */
  @Input('configPagination') configPagination: any; //TODO: agregar modelo ConfigPagination
  /*
   * Se ejecuta cuando se cambia el paginado
   */
  @Output() onChangePage: EventEmitter<any> = new EventEmitter<any>();
  /*
   * Valido si es una acción o una columna normal
   */
  @Input('expandable') expandable: boolean = false;
  /*
   * Para atajar evento de click row en las acciones
   */
  expansion: boolean = false;
  /*
   * Se ejecuta cuando se expande la fila
   */
  @Output() onExpandRow: EventEmitter<any> = new EventEmitter<any>();
  /*
   * Permite clickear y expandir la fila presionando en cualquier espacio de la misma
   */
  @Input('rowClickeable') rowClickeable: boolean = true;
  /*
   * Cierra el expandible cuando pasa de false a true
   */
  @Input('closeExpandible') closeExpandible: boolean = false;

  @ContentChild(TemplateRef, {static: true}) templateRef: TemplateRef<any>;

  expandedElement: any;

  dataSource: any;

  cuilmask = [/\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/];

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  lodash: any = _;

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this._displayedData? this._displayedData:ELEMENT_DATA);
    this.dataSource.sort = this.sort;

    this._displayedColumns = this.displayedColumns?
      _.map(
        _.filter(this.displayedColumns,function(colF){ return !colF.notShow; }),
        function(col) { return col.key})
      :
      ['position', 'name', 'weight', 'symbol'];

    if(this.showFilters){
      // armo campos para filtros
      this.filterFields = _.map(_.filter(this.displayedColumns, function(f){ return f.filtrable; }),function(o){ return o.type; });
      this.filterFields.push({name: 'submit', type:'submit', title:'Buscar', size:'span-1'});
      if (this.extraFilterButtons && this.extraFilterButtons.length){
        this.filterFields = this.filterFields.concat(this.extraFilterButtons);
      }

    }

  }

  filterChange(event){
    this.onChangeFilter.emit(event);
  }

  /**
   * Se dispara cuando se da click al encabezado de una columna para ordenarla.
   * @param event objeto con el nombre de la columna y el orden
   */
  sortChange(event){
    //console.log(event);
  }

  selectRow(row){
    this.onSelectRow.emit(row);
  }

  changePage(event){
    this.onChangePage.emit(event);
  }
  /*
   * Cuando se ejecuta una accion a la derecha de la tabla
   */
  onClickAction(event, action, element){
    this.expansion = true;
    action.execute? action.execute(element):null;
  }
  /*
   * Se ejecuta al clikear la fila
   * Valida que no sea una columna accion
   * En las acciones no expande !!!
   */
  onClickRow(event, row){
    // busco alguno con el id == expander para ver si es un ampliador de contenido
    const path = event.path || event.composedPath();
    const expander = _.filter(path,function(el){
      return el.id === 'expander'
    })
    /*
     * valido que sea una columna no accion
     * o que la accion sea de expandir y expandio
     */
    if(this.expandable && (!this.expansion || expander.length)){
      this.expandedElement = this.expandedElement === row || (!expander.length && this.rowClickeable)? null : row;
      if(this.expandedElement){
        this.onExpandRow.emit(this.expandedElement);
      }
    }
    // si la columna era accion -> reseteo expansion
    if(this.expansion){
      this.expansion = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // cuando closeExpandible == true -> cierro
    if(changes && changes.closeExpandible
      && changes.closeExpandible.currentValue != changes.closeExpandible.previousValue
      && changes.closeExpandible.currentValue){
      this.expandedElement = null;
      this.expansion = false;
    }
  }

}


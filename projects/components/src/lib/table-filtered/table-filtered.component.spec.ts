import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFilteredComponent } from './table-filtered.component';
import { By } from '@angular/platform-browser';
import {TableFiltersComponent} from '../table-filters/table-filters.component';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';
import {CommonModule} from '@angular/common';
import {TableColumns} from '../models';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('TableFilteredComponent', () => {
  let component: TableFilteredComponent;
  let fixture: ComponentFixture<TableFilteredComponent>;

  interface PeriodicElement {
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

  const displayedColumns: TableColumns[] = [
    {name: 'position', key: 'position'},
    {name: 'name', key: 'name'},
    {name: 'weight', key: 'weight'},
    {name: 'symbol', key: 'symbol'}
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TableFilteredComponent,
        TableFiltersComponent
      ],
      imports: [
        MatTableModule,
        MatIconModule,
        MatPaginatorModule,
        CommonModule,
        BrowserAnimationsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableFilteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show mdc-layout-grid when is rendered', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.mdc-layout-grid'))).toBeTruthy();
  });

  it('should show four columns', () => {
    component.displayedColumns = displayedColumns;
    component.displayedData = ELEMENT_DATA;
    component.ngOnInit();

    fixture.detectChanges();
    const tableFilteredElement: HTMLElement = fixture.nativeElement;
    expect(tableFilteredElement.querySelector('table')).toBeTruthy();
    expect(tableFilteredElement.querySelector('thead')).toBeTruthy();
    expect(tableFilteredElement.querySelectorAll('th').length).toEqual(4);
  });

  it('should show one header row and ten rows', () => {
    component.displayedColumns = displayedColumns;
    component.displayedData = ELEMENT_DATA;
    component.ngOnInit();

    fixture.detectChanges();
    const tableFilteredElement: HTMLElement = fixture.nativeElement;
    expect(tableFilteredElement.querySelector('table')).toBeTruthy();
    expect(tableFilteredElement.querySelector('tbody')).toBeTruthy();
    expect(tableFilteredElement.querySelectorAll('tr.mat-header-row').length).toEqual(1);
    expect(tableFilteredElement.querySelectorAll('tr.mat-row').length).toEqual(10);
  });

  it('should show \'No se encontraron registros\' if  displayedData is empty', () => {
    component.displayedColumns = displayedColumns;
    component.displayedData = [];
    component.ngOnInit();

    fixture.detectChanges();
    const tableFilteredElement: HTMLElement = fixture.nativeElement;
    expect(tableFilteredElement.querySelector('div.no-records').textContent.trim()).toEqual('No se encontraron registros');
  });

  it('should show filters if showFilters is true', () => {
    component.displayedColumns = displayedColumns;
    component.displayedData = ELEMENT_DATA;
    component.showFilters = true;
    component.ngOnInit();

    fixture.detectChanges();
    const tableFilteredElement: HTMLElement = fixture.nativeElement;
    expect(tableFilteredElement.querySelector('lib-table-filters')).toBeTruthy();
  });

  it('should allow click a row if isRowClickable is true', () => {
    component.displayedColumns = displayedColumns;
    component.displayedData = ELEMENT_DATA;
    component.isRowClickable = true;
    component.ngOnInit();

    // spy on event emitter
    spyOn(component.selectRow, 'emit');

    // trigger the click
    const nativeElement = fixture.nativeElement;
    const row = nativeElement.querySelector('tr.mat-row');
    row.dispatchEvent(new Event('click'));

    fixture.detectChanges();

    expect(component.selectRow.emit).toHaveBeenCalledWith(ELEMENT_DATA[0]);
  });

  it('should not allow click a row if isRowClickable is false', () => {
    component.displayedColumns = displayedColumns;
    component.displayedData = ELEMENT_DATA;
    component.isRowClickable = false;
    component.ngOnInit();

    // spy on event emitter
    spyOn(component.selectRow, 'emit');

    // trigger the click
    const nativeElement = fixture.nativeElement;
    const row = nativeElement.querySelector('tr.mat-row');
    row.dispatchEvent(new Event('click'));

    fixture.detectChanges();

    expect(component.selectRow.emit).toHaveBeenCalledTimes(0);
  });

  /*it('should allow expand a row if expandable is true', () => {
    component.displayedData = ELEMENT_DATA;
    component.expandable = true;
    component.ngOnInit();

    // spy on event emitter
    spyOn(component.expandRow, 'emit');

    // trigger the click
    const nativeElement = fixture.nativeElement;
    const row = nativeElement.querySelector('tr.mat-row');
    row.dispatchEvent(new Event('click'));

    fixture.detectChanges();

    expect(component.expandRow.emit).toHaveBeenCalledWith(ELEMENT_DATA[0]);
  });*/
});

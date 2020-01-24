import { NgModule } from '@angular/core';
import { ComponentsComponent } from './components.component';
import { TableFilteredComponent } from './table-filtered/table-filtered.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TableFiltersComponent } from './table-filters/table-filters.component';
import {CommonModule} from '@angular/common';



@NgModule({
  declarations: [ComponentsComponent, TableFilteredComponent, TableFiltersComponent],
  imports: [
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    CommonModule
  ],
  exports: [ComponentsComponent, TableFilteredComponent]
})
export class ComponentsModule { }

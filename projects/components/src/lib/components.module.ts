import { NgModule } from '@angular/core';
import { ComponentsComponent } from './components.component';
import { TableFilteredComponent } from './table-filtered/table-filtered.component';



@NgModule({
  declarations: [ComponentsComponent, TableFilteredComponent],
  imports: [
  ],
  exports: [ComponentsComponent, TableFilteredComponent]
})
export class ComponentsModule { }

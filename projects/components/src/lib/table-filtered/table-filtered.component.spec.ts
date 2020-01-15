import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFilteredComponent } from './table-filtered.component';

describe('TableFilteredComponent', () => {
  let component: TableFilteredComponent;
  let fixture: ComponentFixture<TableFilteredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableFilteredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableFilteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

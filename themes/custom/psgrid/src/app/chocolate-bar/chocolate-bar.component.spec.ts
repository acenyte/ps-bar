import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChocolateBarComponent } from './chocolate-bar.component';

describe('ChocolateBarComponent', () => {
  let component: ChocolateBarComponent;
  let fixture: ComponentFixture<ChocolateBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChocolateBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChocolateBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

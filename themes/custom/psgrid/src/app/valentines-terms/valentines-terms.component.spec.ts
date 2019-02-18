import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValentinesTermsComponent } from './valentines-terms.component';

describe('ValentinesTermsComponent', () => {
  let component: ValentinesTermsComponent;
  let fixture: ComponentFixture<ValentinesTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValentinesTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValentinesTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

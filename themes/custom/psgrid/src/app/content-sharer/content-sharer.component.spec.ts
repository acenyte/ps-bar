import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentSharerComponent } from './content-sharer.component';

describe('ContentSharerComponent', () => {
  let component: ContentSharerComponent;
  let fixture: ComponentFixture<ContentSharerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentSharerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentSharerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

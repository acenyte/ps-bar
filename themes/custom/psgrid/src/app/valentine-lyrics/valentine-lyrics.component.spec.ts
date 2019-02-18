import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValentineLyricsComponent } from './valentine-lyrics.component';

describe('ValentineLyricsComponent', () => {
  let component: ValentineLyricsComponent;
  let fixture: ComponentFixture<ValentineLyricsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValentineLyricsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValentineLyricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

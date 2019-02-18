import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongSharerComponent } from './song-sharer.component';

describe('SongSharerComponent', () => {
  let component: SongSharerComponent;
  let fixture: ComponentFixture<SongSharerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongSharerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongSharerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongResultComponent } from './song-result.component';

describe('SongResultComponent', () => {
  let component: SongResultComponent;
  let fixture: ComponentFixture<SongResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

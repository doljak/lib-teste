import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoljakLibTestComponent } from './doljak-lib-to-do-list.component';

describe('DoljakLibTestComponent', () => {
  let component: DoljakLibTestComponent;
  let fixture: ComponentFixture<DoljakLibTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoljakLibTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoljakLibTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

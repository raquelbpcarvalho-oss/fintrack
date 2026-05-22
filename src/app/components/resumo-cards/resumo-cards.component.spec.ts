import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumoCardsComponent } from './resumo-cards.component';

describe('ResumoCardsComponent', () => {
  let component: ResumoCardsComponent;
  let fixture: ComponentFixture<ResumoCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumoCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumoCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

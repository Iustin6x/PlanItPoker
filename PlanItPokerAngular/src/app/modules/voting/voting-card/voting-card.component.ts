import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardType, CardValue, PREDEFINED_CARD_SETS } from '../../../shared/types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-voting-card',
  imports: [ CommonModule],
  standalone: true,
  templateUrl: './voting-card.component.html',
  styleUrl: './voting-card.component.scss'
})
export class VotingCardComponent {
  @Input() cardType: CardType = CardType.FIBONACCI;
  @Input() customCards: CardValue[] = [];
  @Output() voted = new EventEmitter<CardValue>();
  
  selectedValue: CardValue | null = null;

  get cardValues(): CardValue[] {
    return this.cardType === CardType.CUSTOM 
      ? this.customCards 
      : PREDEFINED_CARD_SETS[this.cardType];
  }

  selectCard(value: CardValue): void {
    this.selectedValue = value;
    this.voted.emit(value);
  }
}

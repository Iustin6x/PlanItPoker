// src/app/shared/services/card-set.service.ts
import { Injectable } from '@angular/core';
import { CardType, RoomCardConfig } from '../../shared/types/card-type';

@Injectable({ providedIn: 'root' })
export class CardSetService {
  private predefinedConfigs: RoomCardConfig[] = [
    { type: 'scrum', cards: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { type: 'fibonacci', cards: [0, 1, 2, 3, 5, 8, 13, 21, 34] },
    { type: 'hours', cards: [0, 0.5, 1, 2, 3, 4, 5, 6, 7, 8] }
  ];

  private customConfigs: RoomCardConfig[] = [];

  getPredefinedConfigs(): RoomCardConfig[] {
    return [...this.predefinedConfigs];
  }

  getCustomConfigs(): RoomCardConfig[] {
    return [...this.customConfigs];
  }

  getConfigByType(type: CardType): RoomCardConfig | undefined {
    return [...this.predefinedConfigs, ...this.customConfigs].find(c => c.type === type);
  }

  addCustomConfig(config: RoomCardConfig): void {
    this.customConfigs.push(config);
  }
}
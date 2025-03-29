// src/app/core/services/card-set.service.ts
import { Injectable, signal } from '@angular/core';
import { CardType, CARD_SETS } from '../../shared/types';

export interface RoomCardConfig {
  type: CardType;
  name: string;
  cards: (number | '?')[];
}

@Injectable({ providedIn: 'root' })
export class CardSetService {
  private readonly predefinedConfigs: RoomCardConfig[] = this.generatePredefinedConfigs();
  private customConfigs = signal<RoomCardConfig[]>([]);

  getPredefinedConfigs(): RoomCardConfig[] {
    return [...this.predefinedConfigs];
  }

  getCustomConfigs(): RoomCardConfig[] {
    return this.customConfigs();
  }

  getConfigByType(type: CardType): RoomCardConfig | undefined {
    return [
      ...this.predefinedConfigs,
      ...this.customConfigs()
    ].find(c => c.type === type);
  }

  addCustomConfig(config: Omit<RoomCardConfig, 'type'>): void {
    const newConfig: RoomCardConfig = {
      ...config,
      type: 'custom' // Adăugăm type automat
    };
    this.customConfigs.update(configs => [...configs, newConfig]);
  }

  private generatePredefinedConfigs(): RoomCardConfig[] {
    return Object.entries(CARD_SETS).map(([type, cards]) => ({
      type: type as Exclude<CardType, 'custom'>,
      name: this.getConfigName(type as CardType),
      cards
    }));
  }

  private getConfigName(type: CardType): string {
    const names: Record<CardType, string> = {
      sequential: 'Scrum Sequence',
      fibonacci: 'Fibonacci Sequence',
      hours: 'Working Hours',
      custom: 'Custom Cards'
    };
    return names[type];
  }
}
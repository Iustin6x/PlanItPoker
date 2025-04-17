import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { VoteStateService } from '../../../core/services/vote-state.service';

@Component({
  selector: 'app-voting-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './voting-results.component.html',
  styleUrl: './voting-results.component.scss'
})
export class VotingResultsComponent {
  voteState = inject(VoteStateService);
  readonly session = this.voteState.voteSession;
  readonly votes = this.voteState.votes;

  readonly colors = ['#3f51b5', '#ff4081', '#4CAF50', '#FFC107', '#9C27B0', '#00BCD4'];

  totalVotes = computed(() => this.votes().length);
  
  average = computed(() => {
    const numericValues = this.votes()
      .map(v => parseFloat(v.cardValue))
      .filter(v => !isNaN(v));
    
    if (numericValues.length === 0) return null;
    return numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
  });

  distribution = computed(() => {
    const distributionMap = new Map<string, number>();
    this.voteState.votes().forEach(v => {
      const count = distributionMap.get(v.cardValue) || 0;
      distributionMap.set(v.cardValue, count + 1);
    });
    return Array.from(distributionMap.entries())
      .map(([value, count]) => ({ value, count }));
  });

  maxCount = computed(() => {
    return this.distribution().reduce((max, item) => 
      Math.max(max, item.count), 0);
  });

  // Adaugă această metodă
pieChartSegments() {
  const distribution = this.distribution();
  const total = this.totalVotes();
  if (total === 0) return [];
  
  let accumulated = 0;
  return distribution.map((item, index) => {
    const start = accumulated;
    const percentage = (item.count / total) * 100;
    accumulated += percentage;
    return {
      color: this.colors[index % this.colors.length],
      start: start + '%',
      end: accumulated + '%'
    };
  });
}

formattedAverage(): string {
  return this.average()?.toFixed(1) ?? 'N/A';
}

pieChartBackground() {
  const segments = this.pieChartSegments();
  if (segments.length === 0) return 'transparent';
  
  return `conic-gradient(
    ${segments.map(s => `${s.color} 0 ${s.end}`).join(', ')}
  )`;
}
  
  getPercentage(count: number) {
    const total = this.totalVotes();
    return total > 0 ? ((count / total) * 100).toFixed(1) : 0;
  }
  
  getColor(value: string) {
    const index = this.distribution().findIndex(item => item.value === value);
    return this.colors[index % this.colors.length];
  }

  
}

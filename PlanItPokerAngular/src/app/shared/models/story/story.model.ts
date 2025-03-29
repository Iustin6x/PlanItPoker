
import { UUID } from '../../types';
import { StoryStatus } from './story-status.enum';

export interface Story {
  id: UUID;
  title: string;
  description: string;
  roomId: UUID;
  status: StoryStatus;
  points?: number;
  votes: Record<UUID, number>;
  history: {
    created: Date;
    updated: Date;
    completed?: Date;
  };
}
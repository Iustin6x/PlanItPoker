export interface Story {
    id: string;
    title: string;
    description?: string;
    status: 'active' | 'completed';
    estimate?: string | number;
  }
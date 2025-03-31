import { Injectable } from '@angular/core';
import { UUID } from '../../shared/types';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUserId: UUID = 'd8a12f04-3c5b-4d7e-8f6a-1c3b9d7e8f6c' as UUID;
  constructor() { }
}

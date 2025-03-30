import { Injectable } from '@angular/core';
import { UUID } from '../../shared/types';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUserId: UUID = '' as UUID;
  constructor() { }
}

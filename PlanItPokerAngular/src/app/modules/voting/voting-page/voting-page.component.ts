import { Component } from '@angular/core';
import { StoryListComponent } from '../../story/story-list/story-list.component';

@Component({
  selector: 'app-voting-page',
  standalone: true,
  imports: [StoryListComponent],
  templateUrl: './voting-page.component.html',
  styleUrl: './voting-page.component.scss'
})
export class VotingPageComponent {

}

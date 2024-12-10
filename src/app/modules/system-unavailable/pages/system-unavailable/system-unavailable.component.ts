import { Component } from '@angular/core';
import { Constants } from 'src/app/shared/constants';

@Component({
  selector: 'app-system-unavailable',
  templateUrl: './system-unavailable.component.html',
  styleUrls: ['./system-unavailable.component.css']
})
export class SystemUnavailableComponent {
  imageUrl = Constants.Assets.Logo;
}

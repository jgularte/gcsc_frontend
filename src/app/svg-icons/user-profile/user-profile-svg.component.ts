import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-user-profile-svg',
  templateUrl: './user-profile-svg.component.html',
  styleUrls: ['./user-profile-svg.component.css']
})
export class UserProfileSvgComponent implements OnInit {
  @Input()
  viewBox = '"0 0 24 24"';
  @Input()
  fill = 'none';
  @Input()
  width = '24px';
  @Input()
  height = '24px';
  @Input()
  stroke = 'currentColor';
  @Input()
  linetype = 'round';
  @Input()
  linewidth = '2';
  constructor() { }

  ngOnInit(): void {
  }

}

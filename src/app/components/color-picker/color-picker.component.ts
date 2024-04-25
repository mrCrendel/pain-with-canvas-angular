import { Component } from '@angular/core';

const colors = [
  'white',
  'black',
  'red',
  'green',
  'blue',
  'yellow',
  'magenta',
  'cyan',
  'orange',
  'purple',
  'pink',
  'brown',
  'gray',
]

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent {
  colors = colors
}

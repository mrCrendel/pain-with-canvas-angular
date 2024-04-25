import { Component } from '@angular/core';
import { figures } from "../../common/figures";


@Component({
  selector: 'app-figure-picker',
  templateUrl: './figure-picker.component.html',
  styleUrls: ['./figure-picker.component.scss']
})
export class FigurePickerComponent {
  figures = figures
}

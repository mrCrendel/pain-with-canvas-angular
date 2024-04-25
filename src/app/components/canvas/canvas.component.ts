import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {Figure, ToolsModel} from "../../store/tools/tools.model";
import {getColor, getFigure} from "../../store/tools/tools.selectors";

export type Coordinates = { x: number; y: number };
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit{
  private dragging = false;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private snapshot: ImageData;
  private dragStartLocation: Coordinates;
  private figure: Figure

  constructor(private store: Store<{ tools: ToolsModel }>) {

  }

  ngOnInit() {
    this.initCanvas()

    this.canvas.addEventListener('mousedown', this.dragStart.bind(this), false);
    this.canvas.addEventListener('mousemove', this.drag.bind(this), false);
    this.canvas.addEventListener('mouseup', this.dragStop.bind(this), false);

    this.store.select(getFigure).subscribe(res => {
      this.figure = res;
    });
    this.store.select(getColor).subscribe(color => {
      this.context.strokeStyle = color
    });
  }

  initCanvas() {
    const container = document.getElementById('canvasContainer');
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!this.canvas) {
      throw new Error('canvas not found');
    }

    this.canvas.width = container?.offsetWidth || 100;
    this.canvas.height = container?.offsetHeight || 100;

    const context =  this.canvas.getContext('2d');
    if (!context) {
      throw new Error('canvas context not found');
    }
    this.context = context
  }


  takeSnapShot() {
    this.snapshot = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }

  restoreSnapShot() {
    this.context.putImageData(this.snapshot, 0, 0);
  }

  getCanvasCoordinates(event: MouseEvent): Coordinates {
    const x = event.clientX - this.canvas.getBoundingClientRect().left;
    const y = event.clientY - this.canvas.getBoundingClientRect().top;

    return {x: x, y: y};
  }
  dragStart(event: MouseEvent) {
    this.dragging = true;
    this.dragStartLocation = this.getCanvasCoordinates(event);
    this.takeSnapShot();
  }

  drag(event: MouseEvent) {
    let position;
    if (this.dragging) {
      this.restoreSnapShot();
      position = this.getCanvasCoordinates(event);
      this.draw(position);
    }
  }

  dragStop(event: MouseEvent) {
    this.dragging = false;
    this.restoreSnapShot();
    const position = this.getCanvasCoordinates(event);
    this.draw(position);
  }

  draw(position: Coordinates) {
    this.context.lineCap = "round";
    this.figure.draw({
      position: position,
      dragStartLocation: this.dragStartLocation,
      context: this.context
    })
    // getDrawFunction(this.figure.index)({
    //   position: position,
    //   dragStartLocation: this.dragStartLocation,
    //   context: this.context
    // })

    this.context.globalCompositeOperation = "source-over";

    this.context.stroke();
  }
}

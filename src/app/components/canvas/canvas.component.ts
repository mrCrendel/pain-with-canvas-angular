import {Component, HostListener, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {Figure, ToolsModel} from "../../store/tools/tools.model";
import {selectColor, selectFigure} from "../../store/tools/tools.selectors";
import {getDrawFunction} from "../../common/figures";
import {addDrawedItem} from "../../store/drawed/drawed.actions";
import {selectDrawedRerender} from "../../store/drawed/drawed.selectors";
import {DrawedItem} from "../../store/drawed/drawed.model";
import createId from "../../helpers/createId";

export type Coordinates = { x: number; y: number };
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit{
  private container: HTMLDivElement
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

    this.store.select(selectFigure).subscribe(res => {
      this.figure = res;
    });
    this.store.select(selectColor).subscribe(color => {
      this.context.strokeStyle = color
    })
    this.store.select(selectDrawedRerender).subscribe((items ) => {
      this.rerender(items)
    })
  }

  initCanvas() {
    this.container = document.getElementById('canvasContainer') as HTMLDivElement;
    if (!this.container) {
      throw new Error('Container element not found!!');
    }
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!this.canvas) {
      throw new Error('canvas not found');
    }

    this.canvas.width = this.container.offsetWidth;
    this.canvas.height = this.container.offsetHeight;

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

  @HostListener('mousedown', ['$event'])
  dragStart(event: MouseEvent) {
    this.dragging = true;
    this.dragStartLocation = this.getCanvasCoordinates(event);
    this.takeSnapShot();
  }

  @HostListener('mousemove', ['$event'])
  drag(event: MouseEvent) {
    let position;
    if (this.dragging) {
      this.restoreSnapShot();
      position = this.getCanvasCoordinates(event);
      this.draw(position);
    }
  }

  @HostListener('mouseup', ['$event'])
  dragStop(event: MouseEvent) {
    this.dragging = false;
    this.restoreSnapShot();
    const position = this.getCanvasCoordinates(event);
    this.draw(position);

    this.store.dispatch(addDrawedItem({item: {
      id: createId(),
      index: this.figure.index,
      position: position,
      dragStartLocation: this.dragStartLocation
    }}))
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

  rerender(redrawList: DrawedItem[]) {
    this.context.clearRect(0, 0, this.container.offsetWidth, this.container.offsetHeight); // Clears the canvas
    console.log("!!! call rerender ", )

    redrawList.forEach(item => {
      getDrawFunction(item.index)({
        position: item.position,
        dragStartLocation: item.dragStartLocation,
        context: this.context
      })
      this.context.stroke();
    })
  }
}

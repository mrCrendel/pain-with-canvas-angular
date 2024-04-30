import {Component, HostListener, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {Figure, ToolsModel} from "../../store/tools/tools.model";
import {selectColor, selectFigure} from "../../store/tools/tools.selectors";
import {getDrawFunction} from "../../common/figures";
import {addDrawedItem} from "../../store/drawed/drawed.actions";
import {selectDrawedList, selectDrawedRerender} from "../../store/drawed/drawed.selectors";
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
  private strokeStyle: string = "#000";
  private drawedList: DrawedItem[] = []

  constructor(private store: Store<{ tools: ToolsModel }>) {
  }

  ngOnInit() {
    this.initCanvas()

    this.store.select(selectFigure).subscribe(res => {
      this.figure = res;
    });
    this.store.select(selectColor).subscribe(color => {
      this.setStrokeStyle(color)
    })
    this.store.select(selectDrawedList).subscribe((items ) => {
      this.drawedList = items
    })
    this.store.select(selectDrawedRerender).subscribe((items ) => {
      this.reDraw(items)
    })
  }

  setStrokeStyle(color: string) {
    this.context.strokeStyle = color
    this.strokeStyle = color
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

    this.context.globalCompositeOperation = "source-over";

    this.context.stroke();
  }

  #scale = 1;
  #offsetX = 0;
  #offsetY = 0;
  cellSize= 40;
  translate = 5



  toVirtualX(xReal: number): number {
    return (xReal + this.#offsetX) * this.#scale;
  }

  toVirtualY(yReal: number): number {
    return (yReal + this.#offsetY) * this.#scale;
  }


  @HostListener('wheel', ['$event'])
  wheel(event: WheelEvent): void {
    event.preventDefault()

    if (event.ctrlKey) {
      if (event.deltaY < 0) {
        this.zoomIn();
      } else if (event.deltaY > 0) {
        this.zoomOut();
      }
      return;
    }


    if (event.deltaY < 0) {
      this.offsetTop()
    } else if (event.deltaY > 0) {
      this.offsetBottom()
    }

    if (event.deltaX < 0) {
      this.offsetLeft()
    } else if (event.deltaX > 0) {
      this.offsetRight()
    }
  }

  offsetLeft(): void {
    this.reDraw(this.drawedList, () => this.setTranslateX(this.translate));
  }

  offsetRight(): void {
    this.reDraw(this.drawedList, () => this.setTranslateX(-this.translate));
  }

  offsetTop(): void {
    this.reDraw(this.drawedList, () => this.setTranslateY(this.translate));
  }

  offsetBottom(): void {
    this.reDraw(this.drawedList, () => this.setTranslateY(-this.translate));
  }

  setTranslateX(amount: number): void {
    this.context.translate(amount,0 );
  }

  setTranslateY(amount: number): void {
    this.context.translate(0, amount);
  }

  zoomIn() {
    this.#scale = 1.1;
    this.reDraw(this.drawedList, () => this.setScale())
  }

  zoomOut() {
    this.#scale = 1.0/1.1;
    this.reDraw(this.drawedList, () => this.setScale())
  }

  setScale() {
    this.context.scale(this.#scale, this.#scale);
  }

  clearCanvas() {
    let current_transform = this.context.getTransform();
    this.context.setTransform(1.1, 0, 0, 1.1, 0, 0);
    this.context.clearRect(0, 0, this.container.offsetWidth * this.#scale, this.container.offsetHeight * this.#scale); // Clears the canvas
    this.context.setTransform(current_transform);
  }

  reDraw(redrawList: DrawedItem[], callBack?: () => void) {
    console.log("!!! call reDraw ", )
    this.clearCanvas()

    if (callBack) {
      callBack()
      // this.context.scale(this.#scale, this.#scale);
    }

    // this.drawGrid()

    redrawList.forEach(item => {
      getDrawFunction(item.index)({
        position: item.position,
        dragStartLocation: item.dragStartLocation,
        context: this.context
      })
      this.context.stroke();
    })
  }

  drawGrid() {
    this.context.strokeStyle = "rgb(229,231,235)";
    this.context.lineWidth = 1;
    this.context.font = "10px serif";
    this.context.beginPath();

    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    for (
      let x = (this.#offsetX % this.cellSize) * this.#scale;
      x <= width;
      x += this.cellSize * this.#scale
    ) {
      const source = x;
      this.context.moveTo(source, 0);
      this.context.lineTo(source, height);

      this.context.fillText(
        `${this.toVirtualX(source).toFixed(0)}`,
        source,
        10
      );
    }

    for (
      let y = (this.#offsetY % this.cellSize) * this.#scale;
      y <= height;
      y += this.cellSize * this.#scale
    ) {
      const destination = y;
      this.context.moveTo(0, destination);
      this.context.lineTo(width, destination);

      this.context.fillText(
        `${this.toVirtualY(destination).toFixed(0)}`,
        0,
        destination
      );
    }

    this.context.stroke();
    this.context.strokeStyle = this.strokeStyle;
  }
}

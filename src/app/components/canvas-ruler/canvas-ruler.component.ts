import {Component, HostListener, OnInit} from '@angular/core';

const MAJOR_INTERVAL_RATIO = 0.5
const MINOR_INTERVAL_RATIO = 0.2
const TICKS_PER_MAJOR_INTERVAL = 10
const CURSOR_FPS = 48
const GUTTER_SIZE = 15

@Component({
  selector: 'app-canvas-ruler',
  templateUrl: './canvas-ruler.component.html',
  styleUrls: ['./canvas-ruler.component.scss']
})
export class CanvasRulerComponent implements OnInit{
  private container: HTMLDivElement
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private canvasRuler: HTMLCanvasElement;
  private contextRuler: CanvasRenderingContext2D;


  ngOnInit() {
    this.initCanvas()
    this.initCursor()
    // this.render('#fff', 'in', 1, this.container.offsetWidth, this.container.offsetHeight, {
    //   backgroundColor: '#474747',
    //   cursorColor: '#ffffff'
    // })
  }


  initCanvas() {
    this.container = document.getElementById('canvasContainer') as HTMLDivElement;
    if (!this.container) {
      throw new Error('Container element not found!!');
    }
    this.canvasRuler = document.getElementById('canvasRuler') as HTMLCanvasElement;
    if (!this.canvasRuler) {
      throw new Error('canvas not found');
    }

    this.canvasRuler.width = this.container.offsetWidth + 32;
    this.canvasRuler.height = this.container.offsetHeight + 32;

    const contextRuler =  this.canvasRuler.getContext('2d');
    if (!contextRuler) {
      throw new Error('canvas context not found');
    }
    this.contextRuler = contextRuler


    this.contextRuler.beginPath();
    for(let i=0;i< this.container.offsetWidth;i+=10){
      var y=(i/100==parseInt(String(i / 100)))?0:10;
      this.contextRuler.moveTo(i+15,y);
      this.contextRuler.lineTo(i+15,15);
      var x=(i/100==parseInt(String(i / 100)))?0:10;
      this.contextRuler.moveTo(x,i+15);
      this.contextRuler.lineTo(15,i+15);
    }
    this.contextRuler.stroke();
  }

  // @HostListener('mousemove', ['$event'])
  // handleMouseMove(e: MouseEvent) {
  //   var canvasOffset=$("#canvasTop").offset();
  //   var offsetX=canvasOffset.left;
  //   var offsetY=canvasOffset.top;
  //
  //   mouseX=parseInt(e.clientX-offsetX);
  //   mouseY=parseInt(e.clientY-offsetY);
  //   $("#movelog").html("Move: "+ mouseX + " / " + mouseY);
  //
  //   // Put your mousemove stuff here
  //
  // }



  cursorX = 0;
  cursorY = 0;
  currentX = 0;
  currentY = 0;
  private cursor: HTMLCanvasElement;
  private cursorCtx: CanvasRenderingContext2D;
  initCursor(){
    this.cursor = document.createElement('canvas');
    this.cursor.style.position = 'absolute';
    this.cursor.style.top = '-16px';
    this.cursor.style.left = '-16px';
    this.cursor.style.zIndex = '1';
    this.cursor.style.width = this.container.offsetWidth + 32 + 'px';
    this.cursor.style.height = this.container.offsetHeight + 32 + 'px';
    this.cursor.style.zIndex = '10000';

    const cursorContext = this.cursor.getContext('2d');
    if (!cursorContext) {
      throw new Error('canvas context not found');
    }
    this.cursorCtx = cursorContext

    this.container.appendChild(this.cursor);
    this.cursor.width = this.container.offsetWidth;
    this.cursor.height = this.container.offsetHeight;

    // this.cursor.className = this.canvas.className;

    // this.cursor.style.zIndex = String((this.canvas.style.zIndex + 1) || 1);

    setInterval(this.refreshCursor.bind(this), 1000 / CURSOR_FPS);

    // this.canvasRuler.onmousemove = this.onmousemove.bind(this);
    addEventListener("mousemove", this.handleOnmousemove.bind(this));
  }
  // @HostListener('mousemove', ['$event'])
  handleOnmousemove(ev: MouseEvent) {
    console.log("onmousemove")
    if (ev.clientX > GUTTER_SIZE) {
      this.cursorX = ev.clientX;
    }
    if (ev.clientY > GUTTER_SIZE) {
      this.cursorY = ev.clientY;
    }
    console.log(this.cursorX, this.cursorY)
  }

  refreshCursor() {
    // console.log("refreshCursor")
    if (this.cursorY !== this.currentY) {
      this.cursorCtx.clearRect(0, 0, GUTTER_SIZE, window.innerHeight);
      this.cursorCtx.beginPath();
      this.cursorCtx.moveTo(0, this.cursorY);
      this.cursorCtx.lineTo(GUTTER_SIZE, this.cursorY);
      this.cursorCtx.stroke();
      this.currentY = this.cursorY;
    }

    if (this.cursorX !== this.currentX) {
      this.cursorCtx.clearRect(0, 0, window.innerWidth, GUTTER_SIZE);
      this.cursorCtx.beginPath();
      this.cursorCtx.moveTo(this.cursorX, 0);
      this.cursorCtx.lineTo(this.cursorX, GUTTER_SIZE);
      this.cursorCtx.stroke();
      this.currentX = this.cursorX;
    }
  }





  // render (color: string, units: string, major: any, width: number, height: number, options: any) {
  //   let svg: any, svgdata: any, ruler: any, url: any;
  //   let DOMURL = window.URL || window.webkitURL || window
  //
  //   options = options || {};
  //
  //   this.context.fillStyle = options.backgroundColor || "#474747";
  //   this.context.strokeStyle = "#ffffff";
  //   this.cursor_ctx.strokeStyle = options.cursorColor || '#ffffff';
  //
  //   this.context.fillRect(0, 0, this.canvas.width, GUTTER_SIZE);
  //   this.context.fillRect(0, 0, GUTTER_SIZE, this.canvas.height);
  //
  //   svgdata = this.constructSVGData.apply(this, [color, units, major]);
  //
  //   ruler = document.createElement('img');
  //
  //
  //   svg = new Blob([svgdata], {
  //     type: "image/svg+xml;charset=utf-8"
  //   });
  //
  //   url = DOMURL.createObjectURL(svg);
  //   ruler.onload = this.onload.apply(this, [ruler, DOMURL, url]);
  //
  //   ruler.src = url;
  // };
  //
  // onload (ruler: any, DOMURL: any, url: any) {
  //   DOMURL.revokeObjectURL(url);
  //   this.fillContextWithRuler(ruler, this.canvas.width, this.canvas.height);
  // }
  //
  // constructSVGData(color: string, units: string, major: number) {
  //   const majorHeight = parseInt(String(GUTTER_SIZE * MAJOR_INTERVAL_RATIO), 10),
  //     minorHeight = parseInt(String(GUTTER_SIZE * MINOR_INTERVAL_RATIO), 10),
  //     tickWidth = parseInt(String(major / 10), 10)
  //
  //   let i = 0,
  //     html = ""
  //
  //   for (i = 0; i < TICKS_PER_MAJOR_INTERVAL; i += 1) {
  //     html += "<div xmlns='http://www.w3.org/1999/xhtml' style='position: absolute; bottom: 0px; width: " + tickWidth + "px; border-bottom: 1px solid #555; border-left: 1px solid #999;  height: " + ((i % 5 === 0) ? majorHeight : minorHeight)  + "px; left: "  + i * tickWidth + "px'></div>";
  //   }
  //
  //   // https://developer.mozilla.org/en-US/docs/HTML/Canvas/Drawing_DOM_objects_into_a_canvas
  //   return "<svg xmlns='http://www.w3.org/2000/svg' width='" + major + "' height='" + GUTTER_SIZE + "'><foreignObject width='100%' height='100%'>" + html + "</foreignObject></svg>";
  // }
  //
  //
  // fillContextWithRuler(ruler: any, width: number, height: number) {
  //   let pattern_holder = document.createElement('canvas'),
  //     pattern_ctx = pattern_holder.getContext('2d');
  //
  //   if (!pattern_ctx) {
  //     throw new Error('pattern_ctx not found');
  //   }
  //
  //   this.context.fillStyle = this.context.createPattern(ruler, 'repeat-x') as CanvasPattern;
  //   this.context.fillRect(GUTTER_SIZE, 0, width, height);
  //
  //   pattern_holder.width = width;
  //   pattern_holder.height = 100;
  //
  //   pattern_ctx.translate(0, 0);
  //   pattern_ctx.scale(-1, 1);
  //   pattern_ctx.rotate(Math.PI / 4 * 2);
  //   pattern_ctx.drawImage(ruler, 0, 0);
  //
  //   this.context.fillStyle = this.context.createPattern(pattern_holder, 'repeat-y') as CanvasPattern;
  //   this.context.fillRect(0, GUTTER_SIZE, width, width);
  // }
  //

}

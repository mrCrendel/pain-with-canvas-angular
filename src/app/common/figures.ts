import {Figure} from "../store/tools/tools.model";
import {Coordinates} from "../components/canvas/canvas.component";

type DrawProps = {
  position: Coordinates
  dragStartLocation: Coordinates
  context: CanvasRenderingContext2D
}

export enum FigureIndexes {
  CIRCLE  = 'circle',
  SQUARE  = 'square',
  LINE = 'line'
}
export type DrawFunction = (props: DrawProps) => void

const methods: Record<FigureIndexes, DrawFunction> = {
  [FigureIndexes.CIRCLE]  ({position, dragStartLocation, context}) {
    const radius = Math.sqrt(Math.pow((dragStartLocation.x - position.x), 2) + Math.pow((dragStartLocation.y - position.y), 2));
    context.beginPath();
    context.arc(dragStartLocation.x, dragStartLocation.y, radius, 0, 2 * Math.PI);
  },
  [FigureIndexes.SQUARE] ({position, dragStartLocation, context}) {
    let coordinates = [],
      radius = Math.sqrt(Math.pow((dragStartLocation.x - position.x), 2) + Math.pow((dragStartLocation.y - position.y), 2)),
      angle = Math.PI / 4,
      sides = 4,
      index = 0;

    for (index; index < sides; index++) {
      coordinates.push({
        x: dragStartLocation.x + radius * Math.cos(angle),
        y: dragStartLocation.y - radius * Math.sin(angle)
      })
      angle += (2 * Math.PI) / sides;
    }


    context.beginPath();
    context.moveTo(coordinates[0].x, coordinates[0].y);

    for (index = 0; index < sides; index++) {
      context.lineTo(coordinates[index].x, coordinates[index].y);
    }

    context.closePath();
  },
  [FigureIndexes.LINE] ({position, dragStartLocation, context}) {
    context.beginPath();
    context.moveTo(dragStartLocation.x, dragStartLocation.y);
    context.lineTo(position.x, position.y);
    context.stroke();
  }
}

export const getDrawFunction = (index: FigureIndexes): DrawFunction => {
  return methods[index]
}

export const figures: Figure[] = [
  {
    title: 'Circle',
    path: 'assets/svg/figures/ellipse.svg',
    index: FigureIndexes.CIRCLE,
    draw: methods[FigureIndexes.CIRCLE]
  },
  {
    title: 'Square',
    path: 'assets/svg/figures/square.svg',
    index: FigureIndexes.SQUARE,
    draw: methods[FigureIndexes.SQUARE]
  },
  {
    title: 'Line',
    path: 'assets/svg/figures/line.svg',
    index: FigureIndexes.LINE,
    draw: methods[FigureIndexes.LINE]
  },
]

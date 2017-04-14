export class Sort {
  by: string;
  direction: Direction;

  constructor() {
    this.direction = Direction.ASC;
  }

  invert() {
    if (this.direction === Direction.ASC) {
      this.direction = Direction.DESC;
    } else {
      this.direction = Direction.ASC;
    }
  }
}

export enum Direction {
  ASC, DESC
}
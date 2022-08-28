import { Component, HostListener, OnInit } from '@angular/core';
import { Square } from './classes/square';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  squares = new Array<Square>();
  squareSideLength = 100;
  colours = [
    "#ffffff",
    "#2f728d",
    "#f2935d",
    "#40c0c0"
  ]
  contentBoxStyling = {};

  ngOnInit() {
    this.generateSquares();
  }

  @HostListener('window:orientationchange', ['$event'])
  private onOrientationChange(event: Event) {
    this.squares = new Array<Square>();
    this.generateSquares();
  }

  @HostListener('window:resize', ['$event'])
  private onResizeEvent(event: Event) {
    this.squares = new Array<Square>();
    this.generateSquares();
  }

  getSquareStyling(square: Square, i: number) {
    return {
      'border': square.borderWidth + 'px solid',
      'border-top-color': square.colour1,
      'border-left-color': square.colour1,
      'border-right-color': square.colour2,
      'border-bottom-color': square.colour2,
      'animation-delay': i + '0ms',
      'background': square.colour1
    }
  }

  private generateSquares() {
    this.contentBoxStyling = {};
    for (let i = 0; i < 1000; i++) {
      let colourPicker = Array<string>();
      this.colours.forEach(c => colourPicker.push(c));
      const borderWidth = this.determineSquareSideLength();
      this.squareSideLength = borderWidth * 2;
      this.squares.push(new Square(`square-${i}`, this.pickAColour(colourPicker), this.pickAColour(colourPicker), borderWidth));
    }
  }

  private pickAColour(colourPicker: Array<string>) {
    const i = Math.floor(Math.random() * colourPicker.length - 1) + 1;
    return colourPicker.splice(i, 1)[0];
  }

  private determineSquareSideLength = () => window.innerWidth / 20;

}

import { Component, OnInit } from '@angular/core';
import { Square } from './classes/square';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  squares = new Array<Square>();
  colours = [
    "#ffffff",
    "#2f728d",
    "#f2935d",
    "#40c0c0"
  ]

  ngOnInit() {
    this.generateSquares();
  }

  private generateSquares() {
    for (let i = 0; i < 1000; i++) {
      let colourPicker = Array<string>();
      this.colours.forEach(c => colourPicker.push(c));
      this.squares.push(new Square(`square-${i}`, this.pickAColour(colourPicker), this.pickAColour(colourPicker)));
    }
  }

  private pickAColour(colourPicker: Array<string>) {
    const i = Math.floor(Math.random() * colourPicker.length - 1) + 1;
    return colourPicker.splice(i, 1)[0];
  }
}

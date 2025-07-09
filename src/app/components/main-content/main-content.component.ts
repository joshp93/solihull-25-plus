import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Square } from 'src/app/models/classes/square';
import { CmsContent } from 'src/app/models/interfaces/cms-content';
import { ContentService } from 'src/app/services/content.service';

@Component({
    selector: 'app-main-content',
    templateUrl: './main-content.component.html',
    styleUrl: './main-content.component.scss',
    standalone: false
})
export class MainContentComponent {
  squares = new Array<Square>();
  squareSideLength = 100;
  colours = ['#ffffff', '#2f728d', '#f2935d', '#40c0c0'];
  content: CmsContent | undefined;

  constructor(
    public contentService: ContentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.contentService
      .getContent(this.route.snapshot.paramMap.get('year')!)
      .subscribe({
        next: (cmsContent) => (this.content = cmsContent),
        error: (error) => console.error(error),
      });
    this.generateSquares();
  }

  @HostListener('window:orientationchange', ['$event'])
  public onOrientationChange(event: Event) {
    this.squares = new Array<Square>();
    this.generateSquares();
    this.getBackgroundStyling();
  }

  @HostListener('window:resize', ['$event'])
  public onResizeEvent(event: any) {
    this.squares = new Array<Square>();
    this.generateSquares();
    this.getBackgroundStyling();
  }

  getBackgroundStyling() {
    return {
      height: `${document.documentElement.scrollHeight}px`,
      'grid-template-columns': `repeat(auto-fit, ${this.squareSideLength}px)`,
      'grid-template-rows': `repeat(auto-fit, ${this.squareSideLength}px)`,
    };
  }

  getSquareStyling(square: Square, i: number) {
    return {
      border: square.borderWidth + 'px solid',
      'border-top-color': square.colour1,
      'border-left-color': square.colour1,
      'border-right-color': square.colour2,
      'border-bottom-color': square.colour2,
      'animation-delay': i + '0ms',
      background: square.colour1,
    };
  }

  getContentStyling() {
    return {
      top: `${this.squareSideLength}px`,
      'min-height': `${
        document.documentElement.scrollHeight -
        this.squareSideLength -
        (window.innerWidth / 100) * 2
      }px`,
    };
  }

  generateSquares() {
    for (let i = 0; i < 1000; i++) {
      let colourPicker = Array<string>();
      this.colours.forEach((c) => colourPicker.push(c));
      const borderWidth = this.determineSquareSideLength();
      this.squareSideLength = borderWidth * 2;
      this.squares.push(
        new Square(
          `square-${i}`,
          this.pickAColour(colourPicker),
          this.pickAColour(colourPicker),
          borderWidth
        )
      );
    }
  }

  pickAColour(colourPicker: Array<string>) {
    const i = Math.floor(Math.random() * colourPicker.length - 1) + 1;
    return colourPicker.splice(i, 1)[0];
  }

  determineSquareSideLength = () => window.innerWidth / 20;
}

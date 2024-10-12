import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute, ParamMap } from '@angular/router';
import { of } from 'rxjs';
import { Square } from 'src/app/models/classes/square';
import { CmsContent } from 'src/app/models/interfaces/cms-content';
import { ContentService } from 'src/app/services/content.service';
import { MainContentComponent } from './main-content.component';

describe('MainContentComponent', () => {
  let component: MainContentComponent;
  let fixture: ComponentFixture<MainContentComponent>;
  let contentServiceStub: Partial<ContentService>;

  beforeEach(async () => {
    contentServiceStub = {
      getContent: (year: string) =>
        of({
          heading: 'Test Content',
          bookingFormHref: 'test-booking-boop.com',
          dateAndTime: 'Test Date and Time',
          descriptionHtml: 'Test Description',
          location: 'Test Location',
          locationHref: 'test-location-boop.com',
          price: 'Test Price',
          subject: 'Test Subject',
        } as CmsContent),
    };

    await TestBed.configureTestingModule({
      declarations: [MainContentComponent],
      providers: [
        { provide: ContentService, useValue: contentServiceStub },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get(name: string) {
                  return name;
                },
              } as ParamMap,
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize squares on init', () => {
    expect(component.squares.length).toBe(1000);
  });

  it('should call getContent on init', () => {
    const route = TestBed.inject(ActivatedRoute);
    route.snapshot.paramMap.get = () => '2024';

    spyOn(component.contentService, 'getContent').and.callThrough();
    component.ngOnInit();
    expect(component.contentService.getContent).toHaveBeenCalledWith('2024');
  });

  it('should handle orientation change', () => {
    spyOn(component, 'generateSquares').and.callThrough();
    component.onOrientationChange(new Event('orientationchange'));
    expect(component.generateSquares).toHaveBeenCalled();
  });

  it('should handle window resize', () => {
    spyOn(component, 'generateSquares').and.callThrough();
    component.onResizeEvent(new Event('resize'));
    expect(component.generateSquares).toHaveBeenCalled();
  });

  it('should return correct background styling', () => {
    const styling = component.getBackgroundStyling();
    expect(styling).toEqual({
      height: `${document.documentElement.scrollHeight}px`,
      'grid-template-columns': `repeat(auto-fit, ${component.squareSideLength}px)`,
      'grid-template-rows': `repeat(auto-fit, ${component.squareSideLength}px)`,
    });
  });

  it('should return correct square styling', () => {
    const square = new Square('square-1', '#ffffff', '#2f728d', 10);
    const styling = component.getSquareStyling(square, 0);
    expect(styling).toEqual({
      border: '10px solid',
      'border-top-color': '#ffffff',
      'border-left-color': '#ffffff',
      'border-right-color': '#2f728d',
      'border-bottom-color': '#2f728d',
      'animation-delay': '00ms',
      background: '#ffffff',
    });
  });

  it('should return correct content styling', () => {
    const styling = component.getContentStyling();
    expect(styling).toEqual({
      top: `${component.squareSideLength}px`,
      'min-height': `${
        document.documentElement.scrollHeight -
        component.squareSideLength -
        (window.innerWidth / 100) * 2
      }px`,
    });
  });

  it('should generate squares correctly', () => {
    expect(component.squares.length).toBe(1000);
  });
});

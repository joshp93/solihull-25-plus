import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { yearGuard } from './year.guard';
import { Observable, of } from 'rxjs';
import { ContentService } from '../services/content.service';
import { CmsContent } from '../models/interfaces/cms-content';

describe('yearGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => yearGuard(...guardParameters));
  let contentServiceStub: Partial<ContentService>;
  let router: Router;
  let navigateSpy: jasmine.Spy;

  beforeEach(() => {
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
    TestBed.configureTestingModule({
      providers: [{ provide: ContentService, useValue: contentServiceStub }],
    });
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('Should navigate to 2024 if no route snapshot provided', () => {
    navigateSpy = spyOn(router, 'navigate').and.stub();
    const guardResponse = TestBed.runInInjectionContext(() => {
      return yearGuard(
        {
          paramMap: {
            get(name: string) {
              return null;
            },
          },
        } as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot
      ) as boolean;
    });
    expect(guardResponse).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/2024']);
  });

  it('Should navigate to the year from the route snapshot provided', () => {
    navigateSpy = spyOn(router, 'navigate').and.stub();
    const guardResponse = TestBed.runInInjectionContext(() => {
      return yearGuard(
        {
          paramMap: {
            get(name: string) {
              return '2026';
            },
          },
        } as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot
      ) as Observable<boolean>;
    });
    guardResponse.subscribe((response) => {
      expect(response).toBeTrue();
      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });

  it('Should navigate to 2024 if the response is falsy from the contentService', () => {
    spyOn(contentServiceStub as any, 'getContent').and.returnValue(
      of(undefined)
    );
    navigateSpy = spyOn(router, 'navigate').and.stub();
    const guardResponse = TestBed.runInInjectionContext(() => {
      return yearGuard(
        {
          paramMap: {
            get(name: string) {
              return '1984';
            },
          },
        } as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot
      ) as Observable<boolean>;
    });
    guardResponse.subscribe((response) => {
      expect(response).toBeFalse();
      expect(navigateSpy).toHaveBeenCalledWith(['/2024']);
    });
  });
});

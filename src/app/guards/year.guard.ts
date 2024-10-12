import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { CmsContent } from '../models/interfaces/cms-content';
import { ContentService } from '../services/content.service';

export const yearGuard: CanActivateFn = (route, state) => {
  const contentService = inject(ContentService);
  const router = inject(Router);
  const year = route.paramMap.get('year');
  if (!year) {
    router.navigate(['/2024']);
    return false;
  }
  return contentService.getContent(year).pipe(
    catchError(() => {
      router.navigate(['/2024']);
      return of(false);
    }),
    map((value) => {
      if (value === false) {
        return value;
      } else if ((value as CmsContent) && (value as CmsContent).heading) {
        return true;
      } else {
        router.navigate(['/2024']);
        return false;
      }
    })
  );
};

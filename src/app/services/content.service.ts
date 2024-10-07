import { Injectable } from '@angular/core';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CmsContent } from "src/app/models/interfaces/cms-content";


@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(private readonly firestore: Firestore) { }

  getContent(year: string) {
    return docData(doc(this.firestore, '2024', 'content')) as Observable<CmsContent | undefined>;
  }
}

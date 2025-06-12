// src/app/services/application-status.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApplicationStatusService {
  private statusUpdatedSource = new Subject<{ jobId: string, applied: boolean }>();
  statusUpdated$ = this.statusUpdatedSource.asObservable();

  updateStatus(jobId: string, applied: boolean) {
    this.statusUpdatedSource.next({ jobId, applied });
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostTrainingsService {
  private apiUrl = 'http://localhost:3000/trainings'; // Change to your NestJS API URL

  constructor(private http: HttpClient) {}

  postTraining(trainingData: any): Observable<any> {
    return this.http.post(this.apiUrl, trainingData);
  }
}

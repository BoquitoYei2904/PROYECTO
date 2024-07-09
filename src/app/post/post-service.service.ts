import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
     
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

  
@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiURL = "http://localhost:3030/api/events";
    
  /*------------------------------------------
  --------------------------------------------
  Http Header Options
  --------------------------------------------
  --------------------------------------------*/
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  httpFileOptions = {
    headers: {
      'Accept': 'application/json',
    },
  };

  constructor(private httpClient: HttpClient) { }


  getFk(table: string): Observable<any> {
    return this.httpClient.get(this.apiURL+"/fk/"+table)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  //get week events
  week(table:string, post:any): Observable<any>{
    return this.httpClient.post(this.apiURL+"/week/"+table, JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  //crear en tabla
  create(table:String, post:any): Observable<any> {
  
    return this.httpClient.post(this.apiURL + table, JSON.stringify(post), this.httpOptions)
  
    .pipe(
      catchError(this.errorHandler)
    )
  }
  // LOGIN

  check(post:any): Observable<any> {
    return this.httpClient.post(this.apiURL+"/check/log", JSON.stringify(post), this.httpOptions)

    .pipe(
      catchError(this.errorHandler)
    )
  }

  //seleccion por curso
  getDocs(table: string, post: any): Observable<any> {
    
    return this.httpClient.post(this.apiURL+table, JSON.stringify(post), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  };
  
  read(table:string):Observable<any> {
    return this.httpClient.get(this.apiURL+"/read"+table, this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  //upload file?
  upload(formData: FormData): Observable<any> {
    return this.httpClient.post(this.apiURL + "/api/upload", formData, this.httpFileOptions)
      .pipe(
        catchError(this.errorHandler)
      );
  };


  // SI ERROR
  errorHandler(error:any) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
 }
}

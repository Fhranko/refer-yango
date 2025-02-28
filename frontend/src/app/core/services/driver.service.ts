import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../enviroments/enviroment.local'; // Importar configuración

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  private apiUrl = environment.apiUrl; // Usa la URL según el entorno

  constructor(private http: HttpClient) {}

  registerDriver(driverData: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/drivers/register`, driverData)
      .pipe(catchError(this.handleError));
  }

  getDrivers(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/drivers`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error(`Error en la API: ${error.status} - ${error.message}`);

    // Intentamos obtener el mensaje exacto del backend
    const errorMessage = error.error?.message || 'Ocurrió un error inesperado.';

    return throwError(() => new Error(errorMessage));
  }
}

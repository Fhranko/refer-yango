import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../enviroments/enviroment.local'; // Importar configuración

@Injectable({
  providedIn: 'root',
})
export class ReferralService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl; // Usa la URL según el entorno

  registerReferral(referralsData: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/referrals`, referralsData)
      .pipe(catchError(this.handleError));
  }

  getReferrals(filters: any): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/referrals`, { params: filters })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error(`Error en la API: ${error.status} - ${error.message}`);

    // Intentamos obtener el mensaje exacto del backend
    const errorMessage = error.error?.message || 'Ocurrió un error inesperado.';

    return throwError(() => new Error(errorMessage));
  }
}

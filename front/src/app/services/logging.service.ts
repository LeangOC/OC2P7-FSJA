import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './../config'

@Injectable({
  providedIn: 'root'
})
export class LoggingService {


private readonly apiUrl = `${API_BASE_URL}/api/logs`;

  constructor(private http: HttpClient) {}

  log(level: string, message: string, page: string): void {

    const payload = {
      application: 'microcrm',
      source: 'frontend',
      level: level,
      page: page,
      message: message,
      timestamp: new Date().toISOString()
    };

    // Affichage dans la console navigateur
    console.log(payload);

    // Envoi au backend
    this.http.post(this.apiUrl, payload).subscribe({
      error: err => console.error('Erreur lors de l\'envoi du log', err)
    });
  }

  info(message: string, page: string) {
    this.log('INFO', message, page);
  }

  warn(message: string, page: string) {
    this.log('WARN', message, page);
  }

  error(message: string, page: string) {
    this.log('ERROR', message, page);
  }
}

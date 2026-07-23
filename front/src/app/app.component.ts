import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoggingService } from './services/logging.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MicroCRM';
  constructor(private loggingService: LoggingService) {}

    ngOnInit(): void {

      this.loggingService.info(
        'Application Angular démarrée',
        '/'
      );

    }

}

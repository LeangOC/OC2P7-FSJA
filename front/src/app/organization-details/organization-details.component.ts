import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Person, PersonService } from '../person.service';
import { Organization, OrganizationService } from '../organization.service';
import { LoggingService } from '../services/logging.service';

@Component({
  selector: 'app-organization-details',
  standalone: true,
  imports: [NgIf, FormsModule, AsyncPipe, NgFor, RouterLink, DatePipe],
  templateUrl: './organization-details.component.html',
  styleUrl: './organization-details.component.css'
})
export class OrganizationDetailsComponent implements OnInit {

  org: Organization = {
    id: undefined,
    name: '',
    createdAt: new Date(),
    updatedAt: undefined,
    persons: []
  };

  isNew = false;

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private organizationService: OrganizationService,
    private router: Router,
    private loggingService: LoggingService
  ) {
  }

  ngOnInit(): void {

    const routeParams = this.route.snapshot.paramMap;
    const orgIdParam = routeParams.get('orgId');

    if (orgIdParam === 'new') {

      this.isNew = true;

      this.loggingService.info(
        'Création d\'une nouvelle organisation',
        '/organizations/new'
      );

    } else if (typeof orgIdParam === 'string') {

      const orgId = parseInt(orgIdParam);

      this.loggingService.info(
        `Chargement de l'organisation ${orgId}`,
        '/organizations'
      );

      this.organizationService.fetchById(orgId)
        .then(org => {

          this.org = org;
          this.isNew = false;

          this.loggingService.info(
            `Organisation ${orgId} chargée`,
            '/organizations'
          );

        })
        .catch(error => {

          this.loggingService.error(
            `Erreur lors du chargement de l'organisation ${orgId}`,
            '/organizations'
          );

          console.error(error);

        });

    }

  }

  saveOrg() {

    this.loggingService.info(
      'Sauvegarde d\'une organisation',
      '/organizations'
    );

    this.organizationService.save({
      ...this.org
    })
      .then(o => {

        this.org = o;

        this.loggingService.info(
          `Organisation sauvegardée (id=${o.id})`,
          '/organizations'
        );

        if (this.isNew) {
          this.router.navigate(['organizations', o.id]);
        }

      })
      .catch(error => {

        this.loggingService.error(
          'Erreur lors de la sauvegarde de l\'organisation',
          '/organizations'
        );

        console.error(error);

      });

  }

  deleteOrg() {

    if (this.org.id === undefined) {
      return;
    }

    this.loggingService.warn(
      `Suppression de l'organisation ${this.org.id}`,
      '/organizations'
    );

    this.organizationService.deleteById(this.org.id)
      .then(() => {

        this.loggingService.info(
          'Organisation supprimée',
          '/organizations'
        );

        this.router.navigate(['']);

      })
      .catch(error => {

        this.loggingService.error(
          'Erreur lors de la suppression de l\'organisation',
          '/organizations'
        );

        console.error(error);

      });

  }

}

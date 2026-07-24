import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Person, PersonService } from '../person.service';
import { Organization, OrganizationService } from '../organization.service';
import { LoggingService } from '../services/logging.service';

@Component({
  selector: 'app-person-details',
  standalone: true,
  imports: [NgIf, FormsModule, AsyncPipe, NgFor, RouterLink],
  templateUrl: './person-details.component.html',
  styleUrl: './person-details.component.css'
})
export class PersonDetailsComponent implements OnInit {

  person: Person = {
    id: undefined,
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    bio: '',
    createdAt: new Date(),
    updatedAt: undefined,
    organizations: []
  };

  organizations: Organization[] = [];
  selectedOrganization: Organization | null = null;
  isNew = false;

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private organizationService: OrganizationService,
    private router: Router,
    private loggingService: LoggingService
  ) {

    this.organizationService.fetchAll()
      .then(orgs => {
        this.organizations = orgs;

        this.loggingService.info(
          'Liste des organisations chargée',
          '/persons'
        );
      })
      .catch(error => {

        this.loggingService.error(
          'Erreur lors du chargement des organisations',
          '/persons'
        );

        console.error(error);
      });

  }

  ngOnInit(): void {

    const routeParams = this.route.snapshot.paramMap;
    const personIdParam = routeParams.get('personId');

    if (personIdParam === 'new') {

      this.isNew = true;

      this.loggingService.info(
        'Création d\'une nouvelle personne',
        '/persons/new'
      );

    } else if (typeof personIdParam === 'string') {

      const personId = parseInt(personIdParam);

      this.loggingService.info(
        `Chargement de la personne ${personId}`,
        '/persons'
      );

      this.personService.fetchById(personId)
        .then(p => {

          this.person = p;
          this.isNew = false;

          this.loggingService.info(
            `Personne ${personId} chargée`,
            '/persons'
          );

        })
        .catch(error => {

          this.loggingService.error(
            `Erreur lors du chargement de la personne ${personId}`,
            '/persons'
          );

          console.error(error);

        });
    }
  }

  savePerson() {

    this.loggingService.info(
      'Sauvegarde d\'une personne',
      '/persons'
    );

    this.personService.save({
      ...this.person
    })
      .then(p => {

        this.person = p;

        this.loggingService.info(
          `Personne sauvegardée (id=${p.id})`,
          '/persons'
        );

        if (this.isNew) {
          this.router.navigate(['persons', p.id]);
        }

      })
      .catch(error => {

        this.loggingService.error(
          'Erreur lors de la sauvegarde de la personne',
          '/persons'
        );

        console.error(error);

      });

  }

  deletePerson() {

    if (this.person.id === undefined) {
      return;
    }

    this.loggingService.warn(
      `Suppression de la personne ${this.person.id}`,
      '/persons'
    );

    this.personService.deleteById(this.person.id)
      .then(() => {

        this.loggingService.info(
          'Personne supprimée',
          '/persons'
        );

        this.router.navigate(['']);

      })
      .catch(error => {

        this.loggingService.error(
          'Erreur lors de la suppression de la personne',
          '/persons'
        );

        console.error(error);

      });

  }

  addSelectedOrganization() {

    if (
      this.selectedOrganization?.id === undefined ||
      this.person.id === undefined
    ) {
      return;
    }

    this.organizationService.addPerson(
      this.selectedOrganization.id,
      this.person.id
    );

    this.loggingService.info(
      `Organisation ${this.selectedOrganization.id} ajoutée à la personne ${this.person.id}`,
      '/persons'
    );

    this.refresh();

  }

  removeOrganization(org: Organization) {

    if (
      org.id === undefined ||
      this.person.id === undefined
    ) {
      return;
    }

    this.organizationService.removePerson(
      org.id,
      this.person.id
    );

    this.loggingService.warn(
      `Organisation ${org.id} retirée de la personne ${this.person.id}`,
      '/persons'
    );

    this.refresh();

  }

  refresh() {

    if (this.person.id === undefined) {
      return;
    }

    this.personService.fetchById(this.person.id)
      .then(p => {

        this.person = p;
        this.isNew = false;

        this.loggingService.info(
          `Rafraîchissement de la personne ${this.person.id}`,
          '/persons'
        );

      })
      .catch(error => {

        this.loggingService.error(
          'Erreur lors du rafraîchissement de la personne',
          '/persons'
        );

        console.error(error);

      });

  }

}

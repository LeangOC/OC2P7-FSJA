import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { convertToParamMap } from '@angular/router';

import { PersonDetailsComponent } from './person-details.component';
import { PersonService } from '../person.service';
import { OrganizationService } from '../organization.service';
import { LoggingService } from '../services/logging.service';

describe('PersonDetailsComponent', () => {

  let component: PersonDetailsComponent;
  let fixture: ComponentFixture<PersonDetailsComponent>;

  let personService: jasmine.SpyObj<PersonService>;
  let organizationService: jasmine.SpyObj<OrganizationService>;
  let loggingService: jasmine.SpyObj<LoggingService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {

    personService = jasmine.createSpyObj('PersonService', [
      'fetchById',
      'save',
      'deleteById'
    ]);

    organizationService = jasmine.createSpyObj('OrganizationService', [
      'fetchAll',
      'addPerson',
      'removePerson'
    ]);

    loggingService = jasmine.createSpyObj('LoggingService', [
      'info',
      'warn',
      'error'
    ]);

    router = jasmine.createSpyObj('Router', ['navigate']);

    organizationService.fetchAll.and.resolveTo([]);

    await TestBed.configureTestingModule({

      imports: [PersonDetailsComponent],

      providers: [

        {
          provide: PersonService,
          useValue: personService
        },

        {
          provide: OrganizationService,
          useValue: organizationService
        },

        {
          provide: LoggingService,
          useValue: loggingService
        },

        {
          provide: Router,
          useValue: router
        },

        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({})
            }
          }
        }

      ]

    }).compileComponents();

    fixture = TestBed.createComponent(PersonDetailsComponent);
    component = fixture.componentInstance;
  });

it('should initialize new person', () => {

  const route = TestBed.inject(ActivatedRoute);

  spyOn(route.snapshot.paramMap, 'get').and.returnValue('new');

  component.ngOnInit();

  expect(component.isNew).toBeTrue();

  expect(loggingService.info).toHaveBeenCalled();

});

it('should load existing person', async () => {

  const person = {

    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: '',
    phone: '',
    bio: '',
    createdAt: new Date(),
    organizations: []

  };

  personService.fetchById.and.resolveTo(person);

  const route = TestBed.inject(ActivatedRoute);

  spyOn(route.snapshot.paramMap, 'get').and.returnValue('1');

  await component.ngOnInit();

  expect(personService.fetchById).toHaveBeenCalledWith(1);

  expect(component.person.id).toBe(1);

});

it('should handle fetch error', async () => {

  personService.fetchById.and.rejectWith('error');

  spyOn(console, 'error');

  const route = TestBed.inject(ActivatedRoute);
  spyOn(route.snapshot.paramMap, 'get').and.returnValue('1');

  component.ngOnInit();

  await Promise.resolve();
  await fixture.whenStable();

  expect(loggingService.error).toHaveBeenCalled();
});

it('should save person', async () => {

  component.person = {

    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: '',
    phone: '',
    bio: '',
    createdAt: new Date(),
    organizations: []

  };

  personService.save.and.resolveTo(component.person);

  component.savePerson();

  await fixture.whenStable();

  expect(personService.save).toHaveBeenCalled();

});

it('should navigate after creating person', async () => {

  component.isNew = true;

  component.person = {

    id: undefined,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    createdAt: new Date(),
    organizations: []

  };

  personService.save.and.resolveTo({

    ...component.person,

    id: 8

  });

  component.savePerson();

  await fixture.whenStable();

  expect(router.navigate).toHaveBeenCalledWith(['persons', 8]);

});

it('should handle save error', async () => {

  personService.save.and.rejectWith('error');

  spyOn(console, 'error');

  component.savePerson();


  await Promise.resolve();
  await fixture.whenStable();
  expect(loggingService.error).toHaveBeenCalled();
});

it('should delete person', async () => {

  component.person.id = 3;

  personService.deleteById.and.resolveTo();

  component.deletePerson();

  await Promise.resolve();
  await fixture.whenStable();

  expect(personService.deleteById).toHaveBeenCalledWith(3);

  expect(router.navigate).toHaveBeenCalled();

});

it('should not delete person without id', () => {

  component.person.id = undefined;

  component.deletePerson();

  expect(personService.deleteById).not.toHaveBeenCalled();

});

it('should handle delete error', async () => {

  component.person.id = 2;

  personService.deleteById.and.rejectWith('error');

  spyOn(console, 'error');

  component.deletePerson();

 await Promise.resolve();
  await fixture.whenStable();

  expect(loggingService.error).toHaveBeenCalled();

});

it('should refresh person', async () => {

  component.person.id = 2;

  personService.fetchById.and.resolveTo(component.person);

  component.refresh();

  await fixture.whenStable();

  expect(personService.fetchById).toHaveBeenCalledWith(2);

});


it('should handle refresh error', async () => {

  component.person.id = 2;

  personService.fetchById.and.rejectWith('error');

  spyOn(console, 'error');

  component.refresh();

 await Promise.resolve();
  await fixture.whenStable();

  expect(loggingService.error).toHaveBeenCalled();

});

it('should not refresh without id', () => {

  component.person.id = undefined;

  component.refresh();

  expect(personService.fetchById)
      .not.toHaveBeenCalled();

});

it('should add selected organization', () => {

  component.person.id = 1;

  component.selectedOrganization = {

    id: 10,
    name: 'OC',

    createdAt: new Date(),

    persons: []

  };

  spyOn(component, 'refresh');

  component.addSelectedOrganization();

  expect(organizationService.addPerson)
      .toHaveBeenCalledWith(10,1);

  expect(component.refresh).toHaveBeenCalled();

});

it('should not add organization when organization is undefined', () => {

  component.person.id = 1;
  component.selectedOrganization = null;

  component.addSelectedOrganization();

  expect(organizationService.addPerson)
      .not.toHaveBeenCalled();

});


it('should remove organization', () => {

  component.person.id = 1;

  const org = {

    id: 5,

    name: 'OC',

    createdAt: new Date(),

    persons: []

  };

  spyOn(component,'refresh');

  component.removeOrganization(org);

  expect(organizationService.removePerson)
      .toHaveBeenCalledWith(5,1);

  expect(component.refresh).toHaveBeenCalled();

});

it('should not remove organization when id is undefined', () => {

  component.person.id = undefined;

  component.removeOrganization({
    id: 5,
    name: 'OC',
    createdAt: new Date(),
    persons: []
  });

  expect(organizationService.removePerson)
      .not.toHaveBeenCalled();

});







});

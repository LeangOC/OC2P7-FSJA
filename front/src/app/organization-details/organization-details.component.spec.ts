import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OrganizationDetailsComponent } from './organization-details.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { OrganizationService } from '../organization.service';
import { PersonService } from '../person.service';
import { LoggingService } from '../services/logging.service';

describe('OrganizationDetailsComponent', () => {

  let component: OrganizationDetailsComponent;
  let fixture: ComponentFixture<OrganizationDetailsComponent>;

  let organizationService: jasmine.SpyObj<OrganizationService>;
  let personService: jasmine.SpyObj<PersonService>;
  let loggingService: jasmine.SpyObj<LoggingService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {

    organizationService = jasmine.createSpyObj(
      'OrganizationService',
      ['fetchById', 'save', 'deleteById']
    );

    personService = jasmine.createSpyObj(
      'PersonService',
      ['fetchAll']
    );

    loggingService = jasmine.createSpyObj(
      'LoggingService',
      ['info', 'warn', 'error']
    );

    router = jasmine.createSpyObj(
      'Router',
      ['navigate']
    );

    organizationService.fetchById.and.resolveTo({
      id: 1,
      name: 'OpenAI',
      createdAt: new Date(),
      updatedAt: new Date(),
      persons: []
    });

    await TestBed.configureTestingModule({
      imports: [OrganizationDetailsComponent, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'new'
              }
            }
          }
        },
        {
          provide: OrganizationService,
          useValue: organizationService
        },
        {
          provide: PersonService,
          useValue: personService
        },
        {
          provide: LoggingService,
          useValue: loggingService
        },
        {
          provide: Router,
          useValue: router
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize new organization mode', () => {

    component.ngOnInit();

    expect(component.isNew).toBeTrue();

    expect(loggingService.info).toHaveBeenCalledWith(
      "Création d'une nouvelle organisation",
      '/organizations/new'
    );

  });

it('should save a new organization and navigate', fakeAsync(() => {

  component.isNew = true;
  component.org = {
    id: undefined,
    name: 'OC',
    createdAt: new Date(),
    persons: []
  };

  const saved = {
    ...component.org,
    id: 10
  };

  organizationService.save.and.returnValue(Promise.resolve(saved));

  component.saveOrg();
  tick();

  expect(component.org.id).toBe(10);
  expect(router.navigate).toHaveBeenCalledWith(['organizations', 10]);
  expect(loggingService.info).toHaveBeenCalled();

}));
it('should handle save error', fakeAsync(() => {

  organizationService.save.and.returnValue(
    Promise.reject('error')
  );

  spyOn(console, 'error');

  component.saveOrg();

  tick();

  expect(loggingService.error).toHaveBeenCalled();

}));

it('should delete organization', fakeAsync(() => {

  component.org.id = 5;

  organizationService.deleteById.and.returnValue(
    Promise.resolve()
  );

  component.deleteOrg();

  tick();

  expect(router.navigate).toHaveBeenCalledWith(['']);
  expect(loggingService.info).toHaveBeenCalled();

}));

it('should handle delete error', fakeAsync(() => {

  component.org.id = 5;

  organizationService.deleteById.and.returnValue(
    Promise.reject('error')
  );

  spyOn(console, 'error');

  component.deleteOrg();

  tick();

  expect(loggingService.error).toHaveBeenCalled();

}));

it('should do nothing if organization id is undefined', () => {

  component.org.id = undefined;

  component.deleteOrg();

  expect(organizationService.deleteById).not.toHaveBeenCalled();

});



});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MainDashboardComponent } from './main-dashboard.component';
import { PersonService, Person } from '../person.service';
import { OrganizationService, Organization } from '../organization.service';

describe('MainDashboardComponent', () => {

  let component: MainDashboardComponent;
  let fixture: ComponentFixture<MainDashboardComponent>;

  let personService: jasmine.SpyObj<PersonService>;
  let organizationService: jasmine.SpyObj<OrganizationService>;

  const mockOrganizations: Organization[] = [
    {
      id: 1,
      name: 'OpenClassrooms',
      createdAt: new Date(),
      updatedAt: new Date(),
      persons: []
    }
  ];

  const mockPersons: Person[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@doe.fr',
      phone: '0102030405',
      bio: 'Developer',
      createdAt: new Date(),
      updatedAt: new Date(),
      organizations: mockOrganizations
    }
  ];

  beforeEach(async () => {

    personService = jasmine.createSpyObj<PersonService>('PersonService', [
      'fetchAll'
    ]);

    organizationService = jasmine.createSpyObj<OrganizationService>('OrganizationService', [
      'fetchAll'
    ]);

    personService.fetchAll.and.resolveTo(mockPersons);
    organizationService.fetchAll.and.resolveTo(mockOrganizations);

    await TestBed.configureTestingModule({
      imports: [
        MainDashboardComponent
      ],
      providers: [
        provideRouter([]),

        {
          provide: PersonService,
          useValue: personService
        },
        {
          provide: OrganizationService,
          useValue: organizationService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MainDashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should initialize with empty arrays before ngOnInit', () => {

    expect(component.persons).toEqual([]);
    expect(component.organizations).toEqual([]);
  });

  it('should load persons and organizations on init', async () => {

    fixture.detectChanges();

    await fixture.whenStable();

    expect(personService.fetchAll).toHaveBeenCalledTimes(1);
    expect(organizationService.fetchAll).toHaveBeenCalledTimes(1);

    expect(component.persons).toEqual(mockPersons);
    expect(component.organizations).toEqual(mockOrganizations);
  });

});

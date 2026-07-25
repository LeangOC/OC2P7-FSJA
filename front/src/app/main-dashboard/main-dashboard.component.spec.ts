import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainDashboardComponent } from './main-dashboard.component';
import { PersonService } from '../person.service';
import { OrganizationService } from '../organization.service';

describe('MainDashboardComponent', () => {
  let component: MainDashboardComponent;
  let fixture: ComponentFixture<MainDashboardComponent>;

  let personService: jasmine.SpyObj<PersonService>;
  let organizationService: jasmine.SpyObj<OrganizationService>;

  const mockPersons = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@doe.fr',
      phone: '0102030405',
      bio: 'Developer',
      createdAt: new Date(),
      organizations: []
    }
  ];

  const mockOrganizations = [
    {
      id: 1,
      name: 'OpenClassrooms',
      createdAt: new Date(),
      persons: []
    }
  ];

  beforeEach(async () => {

    personService = jasmine.createSpyObj('PersonService', ['fetchAll']);
    organizationService = jasmine.createSpyObj('OrganizationService', ['fetchAll']);

    personService.fetchAll.and.resolveTo(mockPersons);
    organizationService.fetchAll.and.resolveTo(mockOrganizations);

    await TestBed.configureTestingModule({
      imports: [MainDashboardComponent],
      providers: [
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
    expect(component).toBeTruthy();
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

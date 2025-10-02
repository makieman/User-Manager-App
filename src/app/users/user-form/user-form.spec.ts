import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { UserFormComponent } from './user-form';
import { UserService } from '../user.service';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['get', 'create', 'update']);
    mockUserService.get.and.returnValue(of({ id: 1, firstName: 'Test', lastName: 'User', email: 'test@example.com', role: 'user', active: true }));

    await TestBed.configureTestingModule({
      imports: [UserFormComponent, RouterTestingModule, HttpClientTestingModule],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

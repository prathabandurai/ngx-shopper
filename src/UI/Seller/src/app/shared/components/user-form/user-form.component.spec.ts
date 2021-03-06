import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AppFormErrorService } from '@app-seller/shared';
import { UserFormComponent } from '@app-seller/shared/components/user-form/user-form.component';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  const mockUser = {
    ID: '1',
    Username: 'Products',
    Password: 'test',
    FirstName: 'First',
    LastName: 'Second',
    Email: 'test@email.com',
    Active: true,
  };

  const formErrorService = {
    hasRequiredError: jasmine.createSpy('hasRequiredError'),
    displayFormErrors: jasmine.createSpy('displayFormErrors'),
    hasInvalidIdError: jasmine.createSpy('hasInvalidIdError'),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: AppFormErrorService, useValue: formErrorService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    component.existingUser = mockUser;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should initialize form correctly', () => {
      expect(component.userForm.value).toEqual({
        ID: '1',
        Username: 'Products',
        Password: 'test',
        FirstName: 'First',
        LastName: 'Second',
        Email: 'test@email.com',
        Active: true,
      });
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      spyOn(component.formSubmitted, 'emit');
    });
    it('should call displayFormErrors if form is invalid', () => {
      component.userForm.setErrors({ test: true });
      component['onSubmit']();
      expect(formErrorService.displayFormErrors).toHaveBeenCalled();
    });
    it('should emit formSubmitted event', () => {
      component.userForm.setErrors(null);
      component['onSubmit']();
      expect(component.formSubmitted.emit).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('hasRequiredError', () => {
    beforeEach(() => {
      component['hasRequiredError']('FirstName');
    });
    it('should call formErrorService.hasRequiredError', () => {
      expect(formErrorService.hasRequiredError).toHaveBeenCalledWith(
        'FirstName',
        component.userForm
      );
    });
  });
});

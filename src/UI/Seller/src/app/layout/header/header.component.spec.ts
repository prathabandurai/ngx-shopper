import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from '@app-seller/layout/header/header.component';
import { applicationConfiguration } from '@app-seller/config/app.config';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppStateService } from '@app-seller/shared';
import { OcTokenService } from '@ordercloud/angular-sdk';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  const ocTokenService = {
    RemoveAccess: jasmine.createSpy('RemoveAccess'),
  };
  const appStateService = { isLoggedIn: new BehaviorSubject(false) };
  const router = { navigate: jasmine.createSpy('navigate'), url: '' };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: applicationConfiguration, useValue: {} },
        { provide: AppStateService, useValue: appStateService },
        { provide: OcTokenService, useValue: ocTokenService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('logout', () => {
    beforeEach(() => {
      router.navigate.calls.reset();
    });
    it('should remove token', () => {
      component.logout();
      expect(ocTokenService.RemoveAccess).toHaveBeenCalled();
    });
    it('should refresh current user if user is anonymous', () => {
      appStateService.isLoggedIn.next(true);
      component.logout();
      expect(appStateService.isLoggedIn.value).toEqual(false);
    });
    it('should route to login if user is profiled', () => {
      component.logout();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});

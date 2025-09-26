import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CmsService } from './cms.service';

describe('CmsService', () => {
  let service: CmsService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CmsService]
    });
    service = TestBed.inject(CmsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get users', () => {
    const mockUsers = [{ id: 1, name: 'Test User' }];

    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(`${baseUrl}/users`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should add user', () => {
    const mockUser = { name: 'New User' };

    service.addUser(mockUser).subscribe(response => {
      expect(response).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${baseUrl}/users`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);
    req.flush(mockUser);
  });

  it('should edit user', () => {
    const mockUser = { name: 'Updated User' };
    const userId = '123';

    service.editUser(userId, mockUser).subscribe(response => {
      expect(response).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${baseUrl}/users/${userId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockUser);
    req.flush(mockUser);
  });

  it('should delete user', () => {
    const userId = '123';

    service.deleteUser(userId).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/users/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
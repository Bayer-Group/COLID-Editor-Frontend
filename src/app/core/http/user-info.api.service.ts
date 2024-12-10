import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto } from 'src/app/shared/models/user/user-dto';
import { ColidEntrySubscriptionDto } from 'src/app/shared/models/user/colid-entry-subscription-dto';
import { HierarchicalData } from 'src/app/shared/models/user/hiearchical-dto';

@Injectable({
  providedIn: 'root'
})
export class UserInfoApiService {
  constructor(private httpClient: HttpClient) {}

  createUser(id: string, emailAddress: string): Observable<UserDto> {
    const url = `${environment.appDataApiUrl}/Users/`;
    return this.httpClient.post<UserDto>(url, new UserDto(id, emailAddress));
  }

  getUser(id: string): Observable<UserDto> {
    const url = `${environment.appDataApiUrl}/Users/${id}`;
    return this.httpClient.get<UserDto>(url);
  }

  getUsers(): Observable<UserDto[]> {
    const url = `${environment.appDataApiUrl}/Users`;
    return this.httpClient.get<UserDto[]>(url);
  }

  setLastLoginEditor(id: string, date: Date) {
    const url = `${environment.appDataApiUrl}/Users/${id}/lastLoginEditor`;
    return this.httpClient.put<UserDto>(url, date);
  }

  setDefaultConsumerGroup(
    id: string,
    defaultConsumerGroupUri: string
  ): Observable<any> {
    const url = `${environment.appDataApiUrl}/Users/${id}/defaultConsumerGroup`;
    return this.httpClient.put(url, { uri: defaultConsumerGroupUri });
  }

  addColidEntrySubscription(
    id: string,
    colidEntrySubscriptionDto: ColidEntrySubscriptionDto
  ): Observable<any> {
    const url = `${environment.appDataApiUrl}/Users/${id}/colidEntrySubscriptions`;
    return this.httpClient.put(url, colidEntrySubscriptionDto);
  }

  removeColidEntrySubscription(
    id: string,
    colidEntrySubscriptionDto: ColidEntrySubscriptionDto
  ): Observable<any> {
    const url = `${environment.appDataApiUrl}/Users/${id}/colidEntrySubscriptions`;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: colidEntrySubscriptionDto
    };

    return this.httpClient.delete(url, httpOptions);
  }

  getUserDepartmentsFlowView(): Observable<HierarchicalData> {
    const url = `${environment.searchApiUrl}/User/userDepartmentsFlowView`;
    return this.httpClient.get<HierarchicalData>(url);
  }
}

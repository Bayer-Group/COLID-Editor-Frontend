import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MessageTemplate } from 'src/app/shared/models/message-template/message-template';

@Injectable({
    providedIn: 'root'
})
export class MessageTemplateApiService {

    constructor(private httpClient: HttpClient) { }

    getMessageTemplates(): Observable<MessageTemplate[]> {
        const url = environment.appDataApiUrl + '/messageTemplates';
        return this.httpClient.get<MessageTemplate[]>(url);
    }

    updateMessageTemplate(content: MessageTemplate): Observable<MessageTemplate> {
        const url = environment.appDataApiUrl + '/messageTemplates';
        const jsonContent = JSON.stringify(content);
        return this.httpClient.put<MessageTemplate>(url, jsonContent);
    }

}
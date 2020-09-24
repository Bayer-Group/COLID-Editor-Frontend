import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LogPublisher } from './publishers/log-publisher';
import { LogConsole } from './publishers/log-console';
import { LogColidApi } from './publishers/log-colid-api';

@Injectable()
export class LogPublishersService {

    // Public properties
    public publishers: LogPublisher[] = [];

    constructor(private httpClient: HttpClient) {
        // Build publishers arrays
        this.buildPublishers();
    }

    // Build publishers array
    private buildPublishers(): void {
        // Create instance of LogConsole Class
        this.publishers.push(new LogConsole());
        // Commented out for now... check if there is a problem with the serialization code
        this.publishers.push(new LogColidApi(this.httpClient));
    }
}

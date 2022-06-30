import { ColidAccount } from '../models/colid-account.model';
import { Observable, of } from 'rxjs';

export interface IdentityProvider {
  getAccount(): Observable<ColidAccount>;
  loginInProgress(): boolean;
  isLoggedIn$: Observable<boolean>;
  login(): void;
  logout(): void;
}


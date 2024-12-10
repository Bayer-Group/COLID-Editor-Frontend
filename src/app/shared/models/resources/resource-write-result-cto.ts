import { ValidationResult } from '../validation/validation-result';
import { Resource } from './resource';

export class ResourceWriteResultCTO {
  resource: Resource;
  validationResult: ValidationResult;
}

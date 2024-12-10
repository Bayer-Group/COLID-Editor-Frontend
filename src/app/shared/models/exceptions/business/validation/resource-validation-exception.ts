import { Resource } from '../../../resources/resource';
import { ValidationException } from '../validation-exception';

export class ResourceValidationException extends ValidationException {
  resource: Resource;
}

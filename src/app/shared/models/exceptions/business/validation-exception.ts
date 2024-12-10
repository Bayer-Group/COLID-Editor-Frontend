import { ValidationResult } from '../../validation/validation-result';
import { BusinessException } from '../business-exception';

export class ValidationException extends BusinessException {
  validationResult: ValidationResult;
}

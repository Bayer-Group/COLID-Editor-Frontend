import { Entity } from "src/app/shared/models/Entities/entity";
import { ValidationException } from "../validation-exception";

export class EntityValidationException extends ValidationException {
  entity: Entity;
}

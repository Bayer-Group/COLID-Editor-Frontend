import { LogType } from './log-type';

export interface EdmLogEntry {
  timestamp: Date;
  message: string;
  logType: LogType;

  location: string;
  layer: string;
  product: string;
  hostname: string;

  userId: string;
  department: string;

  elapsedMilliseconds: number;
  additionalInfo: any;
}

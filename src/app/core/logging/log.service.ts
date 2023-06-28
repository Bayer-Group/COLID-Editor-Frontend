import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { LogPublishersService } from "./log-publishers.service";
import { LogPublisher } from "./publishers/log-publisher";
import { LogLevel } from "../../shared/models/logging/log-level";
import { EdmLogEntry } from "../../shared/models/logging/edm-log-entry";
import { LogType } from "src/app/shared/models/logging/log-type";

@Injectable({
  providedIn: "root",
})
export class LogService {
  constructor(private publishersService: LogPublishersService) {
    this.publishers = this.publishersService.publishers;
  }

  publishers: LogPublisher[];

  private static createLogEntry(
    msg: string,
    logType: LogType,
    additionalInfo: any[]
  ): EdmLogEntry {
    const logEntry: EdmLogEntry = {
      timestamp: new Date(),
      message: msg,
      logType: logType,
      product: environment.adalConfig.clientId,
      layer: "angular_client",
      location: window.location.toString(),
      hostname: "",
      userId: "",
      elapsedMilliseconds: null,
      additionalInfo: {},
    };

    logEntry.additionalInfo = {};
    if (additionalInfo != null && additionalInfo.length !== 0) {
      for (const property in additionalInfo) {
        if (
          additionalInfo.hasOwnProperty(property) &&
          property !== "ngDebugContext" &&
          !(additionalInfo[property] instanceof Function)
        ) {
          logEntry.additionalInfo[property] = additionalInfo[property];
        }
      }
    }

    logEntry.additionalInfo["user-agent"] = window.navigator.userAgent;

    return logEntry;
  }

  public log(msg: string, ...optionalDetails: any[]) {
    this.writeLogEntry(msg, LogLevel.Verbose, optionalDetails);
  }

  public debug(msg: string, ...optionalDetails: any[]) {
    this.writeLogEntry(msg, LogLevel.Debug, optionalDetails);
  }

  public info(msg: string, ...optionalDetails: any[]) {
    this.writeLogEntry(msg, LogLevel.Info, optionalDetails);
  }

  public warn(msg: string, ...optionalDetails: any[]) {
    this.writeLogEntry(msg, LogLevel.Warn, optionalDetails);
  }

  public error(msg: string, ...optionalDetails: any[]) {
    this.writeLogEntry(msg, LogLevel.Error, optionalDetails);
  }

  public fatal(msg: string, ...optionalDetails: any[]) {
    this.writeLogEntry(msg, LogLevel.Fatal, optionalDetails);
  }

  private writeLogEntry(
    msg: string,
    logLevel: LogLevel,
    ...optionalDetails: any[]
  ) {
    const logEntry = LogService.createLogEntry(
      msg,
      LogType.General,
      optionalDetails
    );
    this.publishLogEntry(logLevel, logEntry);
  }

  private publishLogEntry(logLevel: LogLevel, logEntry: EdmLogEntry) {
    for (const logger of this.publishers) {
      logger.log(logLevel, logEntry).subscribe();
    }
  }
}

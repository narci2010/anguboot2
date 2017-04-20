import {Injectable} from "@angular/core";
import {ToasterService} from "angular2-toaster/angular2-toaster";
import {HttpError} from "../beans/error";
import {LoggerService, Log} from "./logger.service";<% if (plugins.translate) { %>
import {I18nService} from "../services/i18n.service";<% } %>

export enum NotificationType {
  SUCCESS, INFO, ERROR, WARNING
}

@Injectable()
export class NotificationService {

  private logger: Log;

  constructor(private toaster: ToasterService, protected loggerService: LoggerService<% if (plugins.translate) { %>, private i18n: I18nService<% } %>) {
    this.logger = loggerService.getLogger('service.notification');
  }

  notify(type: NotificationType, header?: string, message?: string): void {
    if (!this.check(header, message)) {
      this.logger.debug('Cannot notify without header or message !');
      return;
    }
    this.toaster.pop(NotificationType[type].toLowerCase(), header, message);
  }

  notifyError(header?: string, message?: string): void {
    if (!this.check(header, message)) {
      this.logger.debug('Cannot notify without header or message !');
      return;
    }
    this.toaster.pop(NotificationType[NotificationType.ERROR].toLowerCase(), header, message);
  }

  notifyHttpError(error: HttpError): void {<% if (plugins.translate) { %>
    this.toaster.pop(NotificationType[NotificationType.ERROR].toLowerCase(), this.i18n.getHttpStatusErrorMessage(error.status));<% } else { %>
    this.toaster.pop(NotificationType[NotificationType.ERROR].toLowerCase(), error.error, error.message);<% } %>
  }

  private check(header?: string, message?: string): boolean {
    return header != null || message != null;
  }
}
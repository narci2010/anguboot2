import {Injectable} from "@angular/core";
import {CanActivate} from "@angular/router";
import {UserService} from "./user.service";

export abstract class Activation implements CanActivate {

  constructor(protected user: UserService) {
  }

  canActivate() {
    return this.internalCanActivate();
  }

  abstract internalCanActivate(): Promise<boolean>;
}

@Injectable()
export class AuthenticatedActivation extends Activation {

  constructor(protected user: UserService) {
    super(user);
  }

  internalCanActivate() {
    return this.user.authenticated(false);
  }

}

@Injectable()
export class AdminActivation extends Activation {

  constructor(protected user: UserService) {
    super(user);
  }

  internalCanActivate() {
    return this.user.hasRole('ROLE_ADMIN', false);
  }

}

@Injectable()
export class ActuatorActivation extends Activation {

  constructor(protected user: UserService) {
    super(user);
  }

  internalCanActivate() {
    return this.user.hasRole('ROLE_ACTUATOR', false);
  }

}
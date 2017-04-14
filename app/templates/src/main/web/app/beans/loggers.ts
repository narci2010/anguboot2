export class Loggers {
  levels: string[];
  loggers: { [key: string]: Logger; };
}
export class Logger {
  name: string;
  configuredLevel: string;
  effectiveLevel: string;
  configuredLevelClass: string;
  effectiveLevelClass: string;
}
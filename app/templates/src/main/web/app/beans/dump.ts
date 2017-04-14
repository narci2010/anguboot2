export class Dump {
  blockedCount: number;
  blockedTime: number;
  inNative: boolean;
  lockInfo: LockInfo;
  lockName: string;
  lockOwnerId: number;
  lockOwnerName: string;
  lockedMonitors: LockInfo[];
  lockedSynchronizers: LockInfo[];
  stackTrace: Object;
  suspended: boolean;
  threadId: number;
  threadName: string;
  threadState: string;
  waitedCount: number;
  waitedTime: number;
}
export class LockInfo {
  className: string;
  identityHashCode: number;
  lockedStackDepth: number;
  lockedStackFrame: Object;
}
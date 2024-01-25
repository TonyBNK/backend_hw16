export type SecurityDeviceViewModel = {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
};

export const securityDeviceViewModelKeys: Array<keyof SecurityDeviceViewModel> =
  ['ip', 'title', 'lastActiveDate', 'deviceId'];

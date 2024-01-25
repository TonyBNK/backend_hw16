import { ExecutionContext, createParamDecorator } from '@nestjs/common';

type DeviceInfoType = {
  ip: string;
  title: string;
};

export const Device = createParamDecorator(
  (key: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const ip = request.ip;
    const deviceTitle = request.get('user-agent');

    const deviceInfo: DeviceInfoType = {
      ip,
      title: deviceTitle,
    };

    return key ? request.deviceInfo[key] : deviceInfo;
  },
);

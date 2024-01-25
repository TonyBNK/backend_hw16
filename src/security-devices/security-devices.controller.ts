import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Cookies } from '../auth/decorators';
import { RefreshTokenGuard } from '../auth/guards';
import { SecurityDeviceViewModel } from '../types';
import { mapSecurityDeviceToViewModel } from '../utils';
import {
  DeleteAllOtherDevicesCommand,
  DeleteSecurityDeviceCommand,
} from './commands';
import { OwnSecurityDeviceGuard, SecurityDeviceExistsGuard } from './guards';
import { GetSecurityDevicesQuery } from './queries';

@Controller('security/devices')
export class SecurityDevicesController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Get()
  @UseGuards(RefreshTokenGuard)
  async getSecurityDevices(
    @Cookies('refreshToken') refreshToken: string,
  ): Promise<Array<SecurityDeviceViewModel>> {
    const securityDevices = await this.queryBus.execute(
      new GetSecurityDevicesQuery(refreshToken),
    );

    return securityDevices.map(mapSecurityDeviceToViewModel);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RefreshTokenGuard)
  async deleteAllOtherSecurityDevices(
    @Cookies('refreshToken') refreshToken: string,
  ) {
    await this.commandBus.execute(
      new DeleteAllOtherDevicesCommand(refreshToken),
    );
  }

  @Delete(':deviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(
    RefreshTokenGuard,
    SecurityDeviceExistsGuard,
    OwnSecurityDeviceGuard,
  )
  async deleteSecurityDevice(
    @Param('deviceId') deviceId: string,
    // @Cookies('refreshToken') refreshToken: string,
  ) {
    await this.commandBus.execute(new DeleteSecurityDeviceCommand(deviceId));
  }
}

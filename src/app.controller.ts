import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Delete('testing/all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async getHello() {
    await this.appService.deleteAllData();
  }
}

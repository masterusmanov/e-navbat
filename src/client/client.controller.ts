import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ClientService } from './client.service';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientPhoneNumberDto } from './dto/phoneNumber.dto';
import { ValidateOtp } from '../specialist/dto/validate-otp.dto';
import { AddDeviceInfo } from '../decorators/addDeviceToReq';
import { AdminSelfGuard } from '../guards/admin_self.guard';
import { JwtAdminGuard } from '../guards/admin.guard';
import { RefreshTokenDto } from '../admin/dto/refresh-token.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('otp')
  sendOtp(@Body() phoneNumberDto: ClientPhoneNumberDto) {
    return this.clientService.sendOtp(phoneNumberDto);
  };

  @Post('validate')
  validateOtp(@Body() validateOtp: ValidateOtp, @AddDeviceInfo() req: any) {
    return this.clientService.validateOtp(validateOtp, req);
  };

  @UseGuards(AdminSelfGuard)
  @UseGuards(JwtAdminGuard)
  @Post(':id/refresh')
  refreshToken(@Param('id') id: string, @Body() refreshTokenDto: RefreshTokenDto, @Req() req: Request) {
    return this.clientService.refreshToken(id, refreshTokenDto, req);
  }

  @UseGuards(JwtAdminGuard)
  @Get('all')
  findAll() {
    return this.clientService.findAll();
  }

  @UseGuards(AdminSelfGuard)
  @UseGuards(JwtAdminGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(id);
  }

  @UseGuards(AdminSelfGuard)
  @UseGuards(JwtAdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(id, updateClientDto);
  }

  @UseGuards(JwtAdminGuard)
  @UseGuards(AdminSelfGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientService.remove(id);
  }
}

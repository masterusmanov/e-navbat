import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { SpecialistService } from './specialist.service';
import { CreateSpecialistDto } from './dto/create-specialist.dto';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';
import { PhoneNumberDto } from './dto/validate-specialist.dto';
import { ValidateOtp } from './dto/validate-otp.dto';
import { AddDeviceInfo } from '../decorators/addDeviceToReq';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAdminGuard } from '../guards/admin.guard';
import { AdminSelfGuard } from '../guards/admin_self.guard';

@Controller('specialist')
export class SpecialistController {
  constructor(private readonly specialistService: SpecialistService) {}

  @Post('otp')
  create(@Body() phoneNumberDto: PhoneNumberDto) {
    return this.specialistService.sendOtp(phoneNumberDto);
  };

  @Post('validate')
  validateOtp(@Body() validateOtp: ValidateOtp, @AddDeviceInfo() req: any) {
    return this.specialistService.validateOtp(validateOtp, req);
  };

  @Post(':id/refresh')
  refreshToken(@Param('id') id: string, @Body() refreshTokenDto: RefreshTokenDto, @Req() req: Request) {
    return this.specialistService.refreshToken(id, refreshTokenDto, req);
  };

  @UseGuards(JwtAdminGuard)
  @Get()
  findAll() {
    return this.specialistService.findAll();
  }

  @UseGuards(AdminSelfGuard)
  @UseGuards(JwtAdminGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specialistService.findOne(id);
  }

  @UseGuards(AdminSelfGuard)
  @UseGuards(JwtAdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSpecialistDto: UpdateSpecialistDto) {
    return this.specialistService.update(id, updateSpecialistDto);
  }

  @UseGuards(AdminSelfGuard)
  @UseGuards(JwtAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.specialistService.remove(id);
  }
}

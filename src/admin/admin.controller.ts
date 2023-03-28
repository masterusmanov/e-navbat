import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ActivateAdminDto } from './dto/activate-admin.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtAdminGuard } from '../guards/admin.guard';
import { AdminSelfGuard } from '../guards/admin_self.guard';
import { IsCreat } from '../guards/isCreat.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(AdminSelfGuard)
  @UseGuards(JwtAdminGuard)
  @Post()
  create(@Body() createAdminDto: CreateAdminDto,
  @Req() req: Request) {
    return this.adminService.create(createAdminDto, req);
  }

  @Post('login')
  login(@Body() loginAdminDto: LoginAdminDto, @Req() req: Request) {
    return this.adminService.login(loginAdminDto, req);
  }

  @UseGuards(AdminSelfGuard)
  @UseGuards(JwtAdminGuard)
  @Post('/:id/logout')
  logout(@Param('id') id: string, @Body() refreshTokenDto: RefreshTokenDto) {
    return this.adminService.logout(id, refreshTokenDto);
  }

  @UseGuards(AdminSelfGuard)
  @UseGuards(JwtAdminGuard)
  @Post('/:id/update-password')
  updatePassword(@Param('id') id: string, @Body() updatePasswordDtp: UpdatePasswordDto) {
    return this.adminService.updatePassword(id, updatePasswordDtp);
  }

  @UseGuards(IsCreat)
  @UseGuards(JwtAdminGuard)
  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @UseGuards(JwtAdminGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOneById(id);
  }

  @UseGuards(AdminSelfGuard)
  @UseGuards(JwtAdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(id, updateAdminDto);
  }

  @UseGuards(IsCreat)
  @UseGuards(JwtAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
  
  @Post('activate')
  activateAdmin(@Body() activateAdminDto: ActivateAdminDto){
    return this.adminService.activateAdmin(activateAdminDto)
  }

  @Post('deactivate')
  deactivateAdmin(@Body() activateAdminDto: ActivateAdminDto){
    return this.adminService.deactivateAdmin(activateAdminDto)
  }

  @Post('creator')
  creatorAdmin(@Body() activateAdminDto: ActivateAdminDto){
    return this.adminService.creatorAdmin(activateAdminDto)
  }

  @Post('decreator')
  decreatorAdmin(@Body() activateAdminDto: ActivateAdminDto){
    return this.adminService.decreatorAdmin(activateAdminDto)
  }
}

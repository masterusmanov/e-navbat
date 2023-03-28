import {Injectable, HttpException, HttpStatus, UnauthorizedException, BadRequestException} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './schema/admin.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ActivateAdminDto } from './dto/activate-admin.dto';
import { Token, TokenDocument } from '../token/schema/token.schema';
import { JwtService } from '@nestjs/jwt';
import { LoginAdminDto } from './dto/login-admin.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createAdminDto: CreateAdminDto, req: Request) {
    const { adminName, adminPhoneNumber, adminPassword, confirmadminPassword } = createAdminDto;
    const admin = await this.adminModel.findOne({adminPhoneNumber});
    if(admin){
      throw new BadRequestException('this phone number already registrated')
    }
    if(adminPassword !== confirmadminPassword){
      throw new BadRequestException('Password not match')
    }
    const hashed_password = await bcrypt.hash(adminPassword, 7);
    const createdAdmin = await this.adminModel.create({
      ...CreateAdminDto,
      adminPassword: hashed_password,
    });
    const tokens = await this.generateTokenForAdmin(createdAdmin);
    const hashedToken = await bcrypt.hash(tokens.refresh_token, 7)
    const deviceToken = await this.tokenModel.create({tableName: "admin", userId: createdAdmin._id.toString(), userDevice: req.headers['user-agent'], hashedToken })
    return {createdAdmin, tokens, deviceToken};
  };

  private async generateTokenForAdmin(admin: AdminDocument){
    const jwtPayload = { id: admin.id, is_active: admin.is_active, is_creator: admin.is_creator};
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME
      }),
    ])
    return {access_token: accessToken, refresh_token: refreshToken};
  };

  async login(loginAdminDto: LoginAdminDto, req: Request) {
    const {adminPassword, adminPhoneNumber} = loginAdminDto;
    const admin = await this.adminModel.findOne({adminPhoneNumber});
    if(!admin){
      throw new BadRequestException('user not found')
    };
    const veriFy = await bcrypt.compare(adminPassword, admin.adminPassword);
    if(!veriFy){
      throw new BadRequestException('phone number or password not correct')
    };
    const tokens = await this.generateTokenForAdmin(admin)
    const hashedToken = await bcrypt.hash(tokens.refresh_token, 7)
    const deviceToken = await this.tokenModel.findOneAndUpdate({userId: admin._id.toString()},{tableName: "admin", userId: admin._id.toString(), userDevice: req.headers['user-agent'], hashedToken }, {new: true});
    return {admin, tokens, deviceToken};
  };

  async logout(id:string, refreshTokenDto: RefreshTokenDto) {
    const admin = await this.jwtService.verify(refreshTokenDto.refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY});
    if(!admin){throw new BadRequestException('token expired')}
    if(id !== admin.id){throw new UnauthorizedException('You do not have access')}
    const foundAdmin = await this.tokenModel.findOne({userId: admin.id});
    const verify = await bcrypt.compare(refreshTokenDto.refreshToken, foundAdmin.hashedRefreshToken);
    if(!verify){throw new BadRequestException('Access denied')};
    const updateTokenModel = await this.tokenModel.findByIdAndUpdate(foundAdmin.id, {hashed_token: null}, {new: true}); 
    return {message: 'you are logged out', updateTokenModel};
  };

  async activateAdmin(activateAdminDto: ActivateAdminDto) {
    const admin = await this.adminModel.findById(activateAdminDto._id);
    if (!admin) {
      throw new HttpException('Foydalanuvchi topilmadi', HttpStatus.NOT_FOUND);
    }
    admin.is_active = true;
    await admin.save();
    return admin;
  };

  async deactivateAdmin(activateAdminrDto: ActivateAdminDto) {
    const admin = await this.adminModel.findById(activateAdminrDto._id);
    if (!admin) {
      throw new HttpException('Foydalanuvchi topilmadi', HttpStatus.NOT_FOUND);
    }
    admin.is_active = false;
    await admin.save();
    return admin;
  };

  async creatorAdmin(activateAdminDto: ActivateAdminDto) {
    const admin = await this.adminModel.findById(activateAdminDto._id);
    if (!admin) {
      throw new HttpException('Foydalanuvchi topilmadi', HttpStatus.NOT_FOUND);
    }
    admin.is_creator = true;
    await admin.save();
    return admin;
  };

  async decreatorAdmin(activateAdminrDto: ActivateAdminDto) {
    const admin = await this.adminModel.findById(activateAdminrDto._id);
    if (!admin) {
      throw new HttpException('Foydalanuvchi topilmadi', HttpStatus.NOT_FOUND);
    }
    admin.is_creator = false;
    await admin.save();
    return admin;
  };

  async updatePassword(id: string, updatePaswordDto: UpdatePasswordDto){
    const admin = await this.adminModel.findById(id);
    if(!admin){
      throw new BadRequestException('admin not found')
    }
    const toCompare = await bcrypt.compare(updatePaswordDto.oldPassword, admin.adminPassword);
    if(!toCompare){
      throw new BadRequestException('Password not correct')
    }
    if(updatePaswordDto.newPassword !== updatePaswordDto.confirmPassword){
      throw new BadRequestException('newpassword and varification not match')
    }
    const hashedPassword = await bcrypt.hash(updatePaswordDto.newPassword, 7);
    const updatedAdmin = await this.adminModel.findByIdAndUpdate(id, {adminHashedPassword: hashedPassword}, {new: true})
    return {message: "password updted", updatedAdmin}
  }


  findAll() {
    return this.adminModel.find().exec();
  }

  findOneByUserName(adminName: string) {
    return this.adminModel.findOne({ adminName }).exec();
  }

  findOneById(id: string) {
    return this.adminModel.findById(id).exec();
  }

  update(id: string, updateAdminDto: UpdateAdminDto) {
    return this.adminModel
      .findByIdAndUpdate(id, updateAdminDto, { new: true })
      .exec();
  }

  remove(id: string) {
    return this.adminModel.findByIdAndDelete(id);
  }
}

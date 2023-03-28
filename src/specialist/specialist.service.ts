import { Injectable, BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Specialist, SpecialistDocument } from './schema/specialist.shcema';
import { Otp, OtpDocument } from '../otp/schema/otp.schema';
import { Token, TokenDocument } from '../token/schema/token.schema';
import { JwtService } from '@nestjs/jwt';
import { FilesService } from '../files/files.service';
import { PhoneNumberDto } from './dto/validate-specialist.dto';
import otpGenerator from 'otp-generator';
import { AddMinutesToDate } from '../helper/addMinutes';
import { dates, decode, encode } from '../helper/crypto';
import { ValidateOtp } from './dto/validate-otp.dto';
import * as bcrypt from 'bcrypt';
import { RefreshTokenDto } from './dto/refresh-token.dto';


@Injectable()
export class SpecialistService {
  constructor(@InjectModel(Specialist.name) private specialistModel: Model<SpecialistDocument>,
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    private readonly jwtService: JwtService, 
    private readonly fileService: FilesService) {}

    async sendOtp(phoneNumberDto: PhoneNumberDto) {
      const phoneNumber = phoneNumberDto.specPhoneNumber;
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
      });
        
      const now = new Date();
      const expiration_time = AddMinutesToDate(now, 2);
      const newOtp = await this.otpModel.create({otp, expiration_time})
      const details = {
        timestamp: now,
        check: phoneNumber,
        success: true,
        message: "OTP sent to user",
        otp_id: newOtp._id.toString(),
      }    
      const encoded = await encode(JSON.stringify(details));
      return {status: "Success", Details: encoded}
    }
  
    async validateOtp(validateOtp: ValidateOtp, req: any){
      const {verificationKey, otp, check} = validateOtp;
      const currentdate = new Date();
      const decoded = await decode(verificationKey);
      const obj = JSON.parse(decoded);
      const checkObj = obj.check;
      if(checkObj != check){
        throw new BadRequestException('OTP bu raqamga junatilmagan');
      }; 
      const getOtp = await this.otpModel.findById(obj.otpId);
      if(getOtp.verified){
        throw new BadRequestException('OTP already used');
      };
      if(!getOtp){
        throw new BadRequestException('OTP not found');
      };  
      if(!dates.compare(getOtp.expirationTime, currentdate)){
        throw new BadRequestException('OTP expired');
      };
      const spec = await this.specialistModel.findOne({spec_phone_number: check});      
      if(!spec){
        const updatedOtp = await this.otpModel.findByIdAndUpdate(getOtp._id.toString(), {verified: true}, {new: true})
        const newSpec = await this.specialistModel.create({spec_phone_number: check, otp_id: getOtp._id.toString()})
        const tokens = await this.generateTokenForSpec(newSpec);
        const hashedToken = await bcrypt.hash(tokens.refreshToken, 7);
        const deviceToken = await this.tokenModel.create({table_name: "specialist", userId: newSpec._id.toString(), userDevice: `${req.device.ua}`, userOs: `${req.device.os.name} ${req.device.os.version}`, hashedToken })
        return {message: "new", updatedOtp, newSpec, deviceToken, tokens};
      };  
      await this.otpModel.findByIdAndRemove(spec.otpId)
      const updatedOtp = await this.otpModel.findByIdAndUpdate(getOtp._id, {verified: true}, {new: true});
      const updatedSpec = await this.specialistModel.findByIdAndUpdate(spec._id, {otp_id: getOtp._id.toString()});
      const tokens = await this.generateTokenForSpec(spec);
      const hashedToken = await bcrypt.hash(tokens.refreshToken, 7);
      const existDevice = await this.tokenModel.findOne({user_id: spec._id, user_device: req.device.device.vendor});
      let deviceToken;
      if(!existDevice){
         deviceToken = await this.tokenModel.create({table_name: "specialist", userId: spec._id.toString(), userDevice: req.device.ua, userOs: `${req.device.os.name} ${req.device.os.version}`, hashedToken })
      }else{
        deviceToken = await this.tokenModel.findByIdAndUpdate(existDevice._id, {hashedToken})
      }
      return {message: "old", updatedOtp, updatedSpec, deviceToken, tokens};  
    };
  
    private async generateTokenForSpec(spec: SpecialistDocument){
      const jwtPayload = { id: spec.id, is_active: spec.specIsActive, otp_id: spec.otpId};
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(jwtPayload, {
          secret: process.env.ACCESS_TOKEN_KEY,
          expiresIn: process.env.ACCESS_TOKEN_TIME
        }),
        this.jwtService.signAsync(jwtPayload, {
          secret: process.env.REFRESH_TOKEN_KEY,
          expiresIn: process.env.REFRESH_TOKEN_TIME
        }),
      ]);
        return {accessToken: accessToken, refreshToken: refreshToken};
    };
  
    async refreshToken(user_id: string, refreshTokenDto: RefreshTokenDto, req: Request){
      const decodedToken = await this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY
      });
      if(user_id != decodedToken.id){
        throw new UnauthorizedException('User not found');
      };
      const deviceToken = await this.tokenModel.findOne({user_id: decodedToken.id});
      if(!deviceToken){
        throw new UnauthorizedException('User not foud');
      };  
      if(!deviceToken.hashedRefreshToken){
        throw new BadRequestException('token not found');
      };
      const tokenMatch = await bcrypt.compare(refreshTokenDto.refreshToken, deviceToken.hashedRefreshToken);
      if(!tokenMatch){
        throw new ForbiddenException('Forbidden');
      };
      const spec = await this.specialistModel.findById(user_id);
      const tokens = await this.generateTokenForSpec(spec);
      const hashedToken = await bcrypt.hash(tokens.refreshToken, 7);
      const updatedDeviceToken = await this.tokenModel.findByIdAndUpdate(deviceToken._id, {hashedToken});
      return {message: "token updated", tokens, updatedDeviceToken, spec};  
    };

  async findAll() {
    return await this.specialistModel.find().populate('otpId');
  }

  findOne(id: string) {
    return this.specialistModel.findById(id);
  }

  update(id: string, updateSpecialistDto: UpdateSpecialistDto) {
    return this.specialistModel.findByIdAndUpdate(id, updateSpecialistDto, {new: true});
  }

  remove(id: string) {
    return this.specialistModel.findByIdAndDelete(id);
  }
}

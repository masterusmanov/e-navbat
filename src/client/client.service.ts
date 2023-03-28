import { Injectable, BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Client, ClientDocument } from './schema/client.schema';
import { Model } from 'mongoose';
import { Otp, OtpDocument } from '../otp/schema/otp.schema';
import { Token, TokenDocument } from '../token/schema/token.schema';
import { JwtService } from '@nestjs/jwt';
import { FilesService } from '../files/files.service';
import { ClientPhoneNumberDto } from './dto/phoneNumber.dto';
import otpGenerator from 'otp-generator';
import { AddMinutesToDate } from '../helper/addMinutes';
import { dates, decode, encode } from '../helper/crypto';
import { ValidateOtp } from '../specialist/dto/validate-otp.dto';
import * as bcrypt from 'bcrypt';
import { RefreshTokenDto } from '../admin/dto/refresh-token.dto';



@Injectable()
export class ClientService {
  constructor(@InjectModel(Client.name) private clientModel: Model<ClientDocument>,
  @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    private readonly jwtService: JwtService, 
    private readonly fileService: FilesService) {}
    
    async sendOtp(phoneNumberDto: ClientPhoneNumberDto) {
      const phoneNumber = phoneNumberDto.clientPhoneNumber;
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
      });

      const now = new Date();
      const expirationTime = AddMinutesToDate(now, 2); 
      const newOtp = await this.otpModel.create({otp, expirationTime})
      const details = {
        timestamp: now,
        check: phoneNumber,
        otpId: newOtp._id.toString(),
      }     
      const encoded = await encode(JSON.stringify(details));
      return {status: "Success", Details: encoded}
    }

    private async generateTokenForClient(client: ClientDocument){
      const jwtPayload = { id: client.id, is_active: client.clientIsActive, otpId: client.otpId};
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
      return {
        accessToken: accessToken,
        refreshToken: refreshToken
      }
    };

    async refreshToken(user_id: string, refreshTokenDto: RefreshTokenDto, req: Request){
      const decodedToken = await this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY
      });
      
      if(user_id != decodedToken.id){
        throw new UnauthorizedException('User not found');
      };
      const deviceToken = await this.tokenModel.findOne({userId: decodedToken.id});
      if(!deviceToken){
        throw new UnauthorizedException('User not foud');
      };  
      if(!deviceToken.hashedRefreshToken){
        throw new BadRequestException('token not found');
      };      
      const tokenMatch = await bcrypt.compare(refreshTokenDto.refreshToken, deviceToken.hashedRefreshToken);
      if(!tokenMatch){
        throw new ForbiddenException('Forbidden');
      }
      const client = await this.clientModel.findById(user_id);
      const tokens = await this.generateTokenForClient(client);
      const hashedToken = await bcrypt.hash(tokens.refreshToken, 7);
      const updatedDeviceToken = await this.tokenModel.findByIdAndUpdate(deviceToken._id, {hashedToken});
      return {message: "token updated", tokens, updatedDeviceToken, client};  
    };

    async validateOtp(validateOtp: ValidateOtp, req: any){      
      const {verificationKey, otp, check} = validateOtp;
      const currentdate = new Date();
      const decoded = await decode(verificationKey);
      const obj = JSON.parse(decoded);
      const check_obj = obj.check;
      if(check_obj != check){
        throw new BadRequestException('OTP bu raqamga junatilmagan');
      } 
      const getOtp = await this.otpModel.findById(obj.otpId);
      if(!getOtp){
        throw new BadRequestException('OTP not found');
      };
      if(getOtp.verified){
        throw new BadRequestException('OTP already used');
      };  
      if(!dates.compare(getOtp.expirationTime, currentdate)){
        throw new BadRequestException('OTP expired');
      };  
      if(otp !== getOtp.otp){
        throw new BadRequestException("OTP is not match")
      };  
      const client = await this.clientModel.findOne({clientPhoneNumber: check})
      
      if(!client){
        const updatedOtp = await this.otpModel.findByIdAndUpdate(getOtp._id.toString(), {verified: true}, {new: true})
        const newClient = await this.clientModel.create({client_phone_number: check, otp_id: getOtp._id.toString()})
        const tokens = await this.generateTokenForClient(newClient);
        const hashedToken = await bcrypt.hash(tokens.refreshToken,7);        
        const deviceToken = await this.tokenModel.create({tableName: "client", userId: newClient._id.toString(), userDevice: req.device.ua, userOs: `${req.device.os.name} ${req.device.os.version}`, hashedToken })
  
        return { message: "new", updatedOtp, newClient, deviceToken, tokens};
      }

      await this.otpModel.findByIdAndRemove(client.otpId)
      const updatedOtp = await this.otpModel.findByIdAndUpdate(getOtp._id, {verified: true}, {new: true});
      const updatedClient = (await this.clientModel.findByIdAndUpdate(client._id, {otp_id: getOtp._id.toString()}));
      const tokens = await this.generateTokenForClient(client);
      const hashedToken = await bcrypt.hash(tokens.refreshToken, 7);
      const existDevice = await this.tokenModel.findOne({user_id: client._id, user_device: req.headers['user-agent']});
      let deviceToken;
      if(!existDevice){
        deviceToken = await this.tokenModel.create({tableName: "client", userId: client._id.toString(), user_device: req.device.ua, user_os: `${req.device.os.name}+${req.device.os.version}`, hashedToken })
      }else{
        deviceToken = await this.tokenModel.findByIdAndUpdate(existDevice._id, {hashedToken})
      }
      return { message: "old", updatedOtp, updatedClient, deviceToken, tokens }
    }


  findAll() {
    return this.clientModel.find().populate('otpId');
  }

  findOne(id: string) {
    return this.clientModel.findById(id);
  }

  update(id: string, updateClientDto: UpdateClientDto) {
    return this.clientModel.findByIdAndUpdate(id, updateClientDto, {new: true});
  }

  remove(id: string) {
    return this.clientModel.findByIdAndDelete(id);
  }
}

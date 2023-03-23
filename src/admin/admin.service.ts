import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { Model } from 'mongoose';
import * as bcrypt from "bcrypt"
import { LoginAdminDto } from './dto/login_admin.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>, 
    private readonly jwtService: JwtService
  ){}

  async create(createAdminDto: CreateAdminDto): Promise<Admin>{
    const { user_name, password } = createAdminDto
    const hashed_password = await bcrypt.hash(password, 7)
    const createdAdmin = new this.adminModel({
      user_name,
      hashed_password
    })
    return createdAdmin.save()
  }

  /* async login(loginAdminDto: LoginAdminDto, res: Response){
    const { email, password } = loginAdminDto
    const admin = await this.adminModel.findOne({ email }).exec()
    if(!admin){
      throw new UnauthorizedException("Foydalanuvchi ro'yxatdan o'tmagan")
    }
    const IsMatchPass = await bcrypt.compare(password, admin.hashed_password)
    if(!IsMatchPass){
      throw new UnauthorizedException("Parol noto'g'ri")
    }

    const tokens = await this.getTokens(admin)

    const hashed_token = await bcrypt.hash(tokens.refresh_token, 7)

    const updatedAdmin = await this.adminModel.updateOne(
      {id: admin.id}, {$set: {hashed_token: hashed_token}}
    )


  } */

  async findAll(): Promise<Admin[]> {
    return this.adminModel.find().exec()
  }

  findOneById(id: string){
    return this.adminModel.findById(id).exec()
  }

  findOneByUsername(user_name: string){
    return this.adminModel.findOne({ user_name }).exec()
  }

  updateAdmin(id: string, updateAdminDto: UpdateAdminDto){
    return this.adminModel.findByIdAndUpdate(id, updateAdminDto, { new: true }).exec()
  }

  remove(id:string){
    return this.adminModel.findByIdAndDelete(id)
  }


  async getTokens(admin: Admin){
    const jwtPayload = {
      user_name: admin.user_name,
      is_active: admin.is_active,
      is_creator: admin.is_creator
    }

    const [ accessToken, refreshToken ] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME
      })
    ])

    return {
      access_token: accessToken,
      refresh_token: refreshToken
    }
  }



  /* findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  } */
}

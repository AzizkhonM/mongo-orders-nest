import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { Model } from 'mongoose';
import * as bcrypt from "bcrypt"
import { LoginAdminDto } from './dto/login_admin.dto';
import { JwtService } from '@nestjs/jwt'
import { Response } from 'express';
import { textChangeRangeIsUnchanged } from 'typescript';
import { ChangePasswordDto } from './dto/change_password.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private readonly jwtService: JwtService
  ) { }

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const { user_name, password } = createAdminDto
    const hashed_password = await bcrypt.hash(password, 7)
    const createdAdmin = new this.adminModel({
      user_name,
      hashed_password
    })
    return createdAdmin.save()
  }

  async login(loginAdminDto: LoginAdminDto, res: Response) {
    const { user_name, password } = loginAdminDto
    const admin = await this.adminModel.findOne({ user_name }).exec()

    if (!admin) {
      throw new UnauthorizedException("Foydalanuvchi ro'yxatdan o'tmagan")
    }
    const IsMatchPass = await bcrypt.compare(password, admin.hashed_password)
    if (!IsMatchPass) {
      throw new UnauthorizedException("Parol noto'g'ri")
    }
    console.log(admin);
    
    const tokens = await this.getTokens(admin, '641c4cf12a5b84673f325e3a')

    const hashed_token = await bcrypt.hash(tokens.refresh_token, 7)

    const updatedAdmin = await this.adminModel.findOneAndUpdate(
      { user_name },
      { hashed_token: hashed_token },
      { new: true }
    )


    res.cookie("refresh_token", tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true
    })

    return {
      message: "Admin tizimga muvaffaqiyatli kirdi",
      user: updatedAdmin,
      tokens
    }
  }

  async changePassword(_id: string, changePasswordDto: ChangePasswordDto) {
    const admin = this.adminModel.findById({ _id })

    if (changePasswordDto.new_password != changePasswordDto.confirm_password) {
      throw new BadRequestException("Yangi parol bir-biriga mos emas")
    }
    console.log(await bcrypt.hash(changePasswordDto.old_password, 7));
    console.log((await admin).hashed_password);
    if (await bcrypt.hash(changePasswordDto.old_password, 7) != (await admin).hashed_password) {
      throw new BadRequestException("Parol noto'g'ri")
    }

    const updatedAdmin = await this.adminModel.findByIdAndUpdate(
      { _id },
      { $set: { hashed_password: bcrypt.hash(changePasswordDto.new_password, 7) } }
    )

    return {
      message: "Parol muvaffaqiyatli o'zgartirildi!",
      updatedAdmin
    }

  }

  async logout(refreshToken: string, res: Response) {
    const userData = await this.jwtService.verify(refreshToken, {
      secret: process.env.PRIVATE_KEY
    })
    console.log(userData)
    if (!userData) {
      throw new ForbiddenException("Foydalanuvchi topilmadi")
    }
    const updatedUser = await this.adminModel.findOneAndUpdate(
      { id: userData._id },
      { hashed_token: null },
      { new: true }
    )

    res.clearCookie("refresh_token")

    return {
      message: "Foydalanuvchi tizimdan muvaffaqiyatli chiqarildi"
    }

  }

  async activate(id: string) {
    const updatedAdmin = await this.adminModel.findOneAndUpdate(
      { id },
      { is_active: false },
      { new: true }
    )

    if (!updatedAdmin) {
      throw new BadRequestException("Bunday admin tizimda mavjud emas")
    }

    return updatedAdmin
  }

  async findAll(): Promise<Admin[]> {
    return this.adminModel.find().exec()
  }

  findOneById(id: string) {
    return this.adminModel.findById(id).exec()
  }

  findOneByUsername(user_name: string) {
    return this.adminModel.findOne({ user_name }).exec()
  }

  updateAdmin(id: string, updateAdminDto: UpdateAdminDto) {
    return this.adminModel.findByIdAndUpdate(id, updateAdminDto, { new: true }).exec()
  }

  remove(id: string) {
    return this.adminModel.findByIdAndDelete(id)
  }


  async getTokens(admin: Admin, id: string) {
    const jwtPayload = {
      id,
      is_active: admin.is_active,
      is_creator: admin.is_creator,
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.PRIVATE_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.PRIVATE_KEY,
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

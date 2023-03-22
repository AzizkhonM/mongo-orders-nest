import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { Model } from 'mongoose';
import * as bcrypt from "bcrypt"

@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin.name) private adminModel: Model<AdminDocument>){}

  async create(createAdminDto: CreateAdminDto): Promise<Admin>{
    const { user_name, password } = createAdminDto
    const hashed_password = await bcrypt.hash(password, 7)
    const createdAdmin = new this.adminModel({
      user_name,
      hashed_password
    })
    return createdAdmin.save()
  }

  async findAll(): Promise<Admin[]> {
    return this.adminModel.find().exec()
  }

  findOneById(id: string){
    return this.adminModel.findById(id).exec()
  }

  findOneByUsername(user_name: string){
    return this.adminModel.findOne({ user_name }).exec()
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

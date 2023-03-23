import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Res } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { LoginAdminDto } from './dto/login_admin.dto';
import { Response } from 'express';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post("create")
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

 /*  @Post('/signin')
  login(
    @Body() loginAdminDto: LoginAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.login(loginAdminDto, res)
  } */

  @Get("all")
  findAll() {
    return this.adminService.findAll();
  }

  @Get(":id")
  findOneByUserId(@Param("id") id: string){
    return this.adminService.findOneById(id)
  }

  @Get("username/:username")
  findOneByUsername(@Param("username") username: string){
    return this.adminService.findOneByUsername(username)
  }

  @Patch('update/:id')
  async updateAdmin(@Param('id') id: string, @Body() updateStudentDto: UpdateAdminDto) {
    return await this.adminService.updateAdmin(id, updateStudentDto);
  }


  @Delete(":id")
  async deleteAdmin(@Param("id") id: string){
    return await this.adminService.remove(id)
  }


  /* @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  } */
}

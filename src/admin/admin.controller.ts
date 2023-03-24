import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Res, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { LoginAdminDto } from './dto/login_admin.dto';
import { Response } from 'express';
import { CookieGetter } from '../decorators/cookieGetter.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserSelfGuard } from '../guards/user-self.guard';
import { UpdatePassword } from '../guards/update_password.guard';
import { ChangePasswordDto } from './dto/change_password.dto';
import { CreatorGuard } from '../guards/creator.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard)
  @UseGuards(UpdatePassword)
  @Post("change_password/:id")
  async change_password(
    @Param("id") id: string,
    @Body() changePasswordDto: ChangePasswordDto 
  ){
    return await this.adminService.changePassword(id, changePasswordDto)
  }



  @UseGuards(JwtAuthGuard)
  @UseGuards(CreatorGuard)
  @Post("create")
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Post("signout")
  logout(
    @CookieGetter("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ){
    return this.adminService.logout(refreshToken, res)
  }

  @Post('/signin')
  login(
    @Body() loginAdminDto: LoginAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.login(loginAdminDto, res)
  }

  @UseGuards(JwtAuthGuard)
  @Get("all")
  findAll() {
    return this.adminService.findAll();
  }

  @UseGuards(UserSelfGuard)
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findOneByUserId(@Param("id") id: string){
    return this.adminService.findOneById(id)
  }

  @UseGuards(JwtAuthGuard)
  @Get("username/:username")
  findOneByUsername(@Param("username") username: string){
    return this.adminService.findOneByUsername(username)
  }

  @UseGuards(UserSelfGuard)
  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  async updateAdmin(@Param('id') id: string, @Body() updateStudentDto: UpdateAdminDto) {
    return await this.adminService.updateAdmin(id, updateStudentDto);
  }


  @UseGuards(UserSelfGuard)
  @UseGuards(JwtAuthGuard)
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

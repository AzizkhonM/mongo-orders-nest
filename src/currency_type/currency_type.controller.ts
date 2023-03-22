import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CurrencyTypeService } from './currency_type.service';
import { CreateCurrencyTypeDto } from './dto/create-currency_type.dto';
import { UpdateCurrencyTypeDto } from './dto/update-currency_type.dto';

@Controller('currency')
export class CurrencyTypeController {
  constructor(private readonly currencyTypeService: CurrencyTypeService) {}

  @Post("create")
  create(@Body() createCurrencyTypeDto: CreateCurrencyTypeDto) {
    return this.currencyTypeService.create(createCurrencyTypeDto);
  }

  @Get("all")
  findAll() {
    return this.currencyTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.currencyTypeService.findOneById(id);
  }

  @Get("name/:username")
  findOneByUsername(@Param("username") name: string){
    return this.currencyTypeService.findOneByName(name)
  }

  @Patch('update/:id')
  async updateCurrency(@Param('id') id: string, @Body() updateCurrencyTypeDto: UpdateCurrencyTypeDto) {
    return await this.currencyTypeService.updateCurrency(id, updateCurrencyTypeDto);
  }

  @Delete(":id")
  async deleteCurrency(@Param("id") id: string){
    return await this.currencyTypeService.removeCurrency(id)
  }
}

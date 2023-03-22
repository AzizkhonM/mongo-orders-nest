import { Injectable } from '@nestjs/common';
import { CreateCurrencyTypeDto } from './dto/create-currency_type.dto';
import { UpdateCurrencyTypeDto } from './dto/update-currency_type.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CurrencyType, CurrencyTypeDocument } from './schemas/currency_type.schema';
import { Model } from 'mongoose';

@Injectable()
export class CurrencyTypeService {
  constructor(@InjectModel(CurrencyType.name) private currencyTypeModel: Model<CurrencyTypeDocument>){}

  async create(createCurrencyTypeDto: CreateCurrencyTypeDto): Promise<CurrencyType> {
    const createdCurrencyType = new this.currencyTypeModel(createCurrencyTypeDto);
    return createdCurrencyType.save();
  }

  async findAll(): Promise<CurrencyType[]> {
    return this.currencyTypeModel.find().exec()
  }

  findOneById(id: string){
    return this.currencyTypeModel.findById(id).exec()
  }

  updateCurrency(id: string, updateCurrencyTypeDto: UpdateCurrencyTypeDto){
    return this.currencyTypeModel.findByIdAndUpdate(id, updateCurrencyTypeDto, { new: true }).exec()
  }

  findOneByName(name: string){
    return this.currencyTypeModel.findOne({ name }).exec()
  }

  removeCurrency(id:string){
    return this.currencyTypeModel.findByIdAndDelete(id)
  }
}

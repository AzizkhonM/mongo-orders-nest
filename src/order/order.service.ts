import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Admin } from '../admin/schemas/admin.schema';
import { Order, OrderDocument } from './schemas/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>){}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const createdOrder = await new this.orderModel(createOrderDto).save()

    console.log(createdOrder._id)
    
    const updateOrder = await this.orderModel.findByIdAndUpdate(
      String(createdOrder._id),
      { order_unique_id: String(createdOrder._id) },
      { new: true }
    )
    
    return updateOrder
  }

  findAll() {
    return this.orderModel.find().populate("currency_type_id")
  }

  findOneById(id: string){
    return this.orderModel.findById(id).exec()
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true }).exec()
  }

  remove(id: string) {
    return this.orderModel.findByIdAndDelete(id)
  }
}

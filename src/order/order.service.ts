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

    function generateID() {
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const letter1 = letters[Math.floor(Math.random() * letters.length)];
      const letter2 = letters[Math.floor(Math.random() * letters.length)];
      const digits1 = Math.floor(1000000000 + Math.random() * 9000000000);
      const digits2 = Math.floor(1000000000 + Math.random() * 9000000000);
      const digits3 = Math.floor(1000000000 + Math.random() * 9000000000);
      const letter3 = letters[Math.floor(Math.random() * letters.length)];
      const letter4 = letters[Math.floor(Math.random() * letters.length)];
      return letter1 + letter2 + digits1.toString().slice(0, 4) + digits2.toString().slice(0, 4) + digits3.toString().slice(0, 4) + letter3 + letter4;
    }
    
    const id = generateID();
    
    const updateOrder = await this.orderModel.findByIdAndUpdate(
      String(createdOrder._id),
      { order_unique_id: id },
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

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { CurrencyType } from '../../currency_type/schemas/currency_type.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop()
  order_unique_id: string

  @Prop()
  full_name: string;

  @Prop()
  phone_number: string;

  @Prop()
  product_link: string;

  @Prop()
  sum: number;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: "CurrencyType"})
  currency_type_id: CurrencyType;

  @Prop()
  truck: string;

  @Prop()
  email: string;

  @Prop()
  description: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
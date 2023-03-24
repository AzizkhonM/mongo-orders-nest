import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { CurrencyType } from "../../currency_type/schemas/currency_type.schema";

export type AdminDocument = HydratedDocument<Admin>

@Schema()
export class Admin {
    @Prop()
    full_name: string
    
    @Prop({required: true})
    user_name: string
    
    @Prop({required: true})
    hashed_password: string
    
    @Prop()
    phone_number: string
    
    @Prop()
    email: string
    
    @Prop()
    tg_link: string
    
    @Prop({ default: false })
    is_creator: boolean
    
    @Prop({ default: true })
    is_active: boolean
        
    @Prop()
    hashed_token: string

    @Prop()
    description: string
    
}

export const AdminSchema = SchemaFactory.createForClass(Admin)
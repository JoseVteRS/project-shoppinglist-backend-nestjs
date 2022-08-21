import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document

@Schema({
  timestamps: true,
})
export class Product {


  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  note: string;
}


export const ProductSchema = SchemaFactory.createForClass(Product);
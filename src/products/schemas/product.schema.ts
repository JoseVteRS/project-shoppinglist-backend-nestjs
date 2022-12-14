import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Category } from 'src/categories/schemas/category.schema';
import { v4 as generateUUID } from 'uuid';

export type ProductDocument = Product & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Product {
  @Prop({
    type: String,
    _id: false,
    default: () => {
      return generateUUID();
    },
  })
  _id: string;

  @Prop({ type: String, trim: true, required: true })
  name: string;

  @Prop({ type: String })
  note: string;

  @Prop([{ type: String, ref: Category.name }])
  categories: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

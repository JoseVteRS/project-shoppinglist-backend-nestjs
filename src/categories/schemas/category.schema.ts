import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Product } from 'src/products/entities/product.entity';
import { v4 as generateUUID } from 'uuid';

export type CategoryDocument = Category & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Category {
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

  @Prop([{ type: String, ref: Product.name, required: false, index: false }])
  products: string[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);

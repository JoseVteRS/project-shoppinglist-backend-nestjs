import { ProductDocument } from './schemas/product.schema';
import { Product } from './entities/product.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  create(createProductDto: CreateProductDto) {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(): Promise<Product[]> {
    const findedProducts = await this.productModel.find();
    if (!findedProducts) throw new NotFoundException();

    return findedProducts;
  }

  async findOne(id: string) {
    const findedProduct = await this.productModel.findById(id);
    if (!findedProduct) throw new NotFoundException();

    return findedProduct;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    return await this.productModel.findByIdAndUpdate(id, updateProductDto, {
      new: true,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    const removedProduct = await this.productModel.findByIdAndDelete(id);
    return removedProduct;
  }
}

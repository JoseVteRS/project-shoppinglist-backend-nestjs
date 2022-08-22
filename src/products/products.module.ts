import { Product } from './entities/product.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductSchema } from './schemas/product.schema';
import { CategoriesModule } from 'src/categories/categories.module';
import { Category } from 'src/categories/entities/category.entity';
import { CategorySchema } from 'src/categories/schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
    forwardRef(() => CategoriesModule),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}

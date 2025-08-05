import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>
  ) {}

  async onModuleInit() {
    await this.seedProducts();
  }

  // Seed products data if the collection is empty (Dummy data for testing)
  async seedProducts() {
    const count = await this.productModel.countDocuments();
    if (count === 0) {
      await this.productModel.insertMany([
        {
          name: 'Product A',
          price: 100,
          description: 'Description of Product A',
          imageUrl: 'https://cdn.ironpla.net/i/hmpg/2018/excavator.jpg',
        },
        {
          name: 'Product B',
          price: 150,
          description: 'Description of Product B',
          imageUrl:
            'https://lh6.googleusercontent.com/proxy/oZycCP4TpbDyM1piZdCVhtFiYfgsHgg4VgNjHXJqzj1BAzsSPFUNFAWw0W2P3J3kxcCter-ouAbeh-6_BD2iGQjmfxfNA8yVdFvtOciT1Rq7JYA9v4PaFoHCb-2CM8H1aQ',
        },
        {
          name: 'Product C',
          price: 200,
          description: 'Description of Product C',
          imageUrl:
            'https://blog.ritchiebros.com/wp-content/uploads/2022/09/oFLfeb2014-7766.jpg-800x450-1.jpg',
        },
      ]);
      console.log('Seeded products data.');
    }
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }
}

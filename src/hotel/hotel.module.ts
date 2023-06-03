import { Module } from '@nestjs/common';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports:[
    MulterModule.register({
      dest: './src/images',
    }),
  ],
  controllers: [HotelController],
  providers: [HotelService],
})
export class HotelModule {}

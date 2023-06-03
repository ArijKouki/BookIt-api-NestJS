import {
  Body,
  Get,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
  Param,
  Patch, UploadedFile, UseInterceptors, UploadedFiles
} from "@nestjs/common";
import { LoginHotelDto, RegisterHotelDto, UpdateHotelDto } from './dto';
import { HotelService } from './hotel.service';
import { Request, Response } from 'express';
import { GetHotel } from '../decorators';
import {  HotelAuthGuard } from '../guards';
import { checkOldPasswordDto, ResetPasswordDto } from '../auth/dto';
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";


@Controller('hotels')
export class HotelController {
  constructor(private hotelService: HotelService) {}

  @UseGuards(HotelAuthGuard)
  @Get('/mine')
  async getHotel(@GetHotel() hotelId: string, @Res() res: Response) {
    return await this.hotelService.getHotel(hotelId, res);
  }
  //@UseGuards(HotelAuthGuard)
  @Get('/rooms/:id')
  async getAllHotelRooms(@Param('id') hotelId: string, @Res() res: Response) {
    return await this.hotelService.getAllHotelRooms(hotelId, res);
  }


  @UseGuards(HotelAuthGuard)
  @Get('/mine/bookings')
  async getAllHotelBookings(@GetHotel() hotelId: string, @Res() res: Response) {
    return await this.hotelService.getAllHotelBookings(hotelId, res);
  }

  @Get('/all')
  async getAllHotels(@Res() res: Response) {
    return await this.hotelService.getAllHotels(res);
  }

  @Get('/:id')
  async getHotelById(@Param('id') id: string, @Res() res: Response) {
    return await this.hotelService.getHotelById(id, res);
  }

  @Post('/register')
  @UseInterceptors(
    FileInterceptor('photo', {
      fileFilter: (req, file, callback) => {
        callback(null, true); // Allow all files
      },
      storage: diskStorage({
        destination: './src/images', // Set the destination folder for uploaded files
        filename: (req, file, callback) => {
          callback(null, file.originalname); // Use the original filename
        },
      }),
    })
  )
  async registerHotel(@Body() dto: RegisterHotelDto, @UploadedFile() photo: Express.Multer.File, @Res() res: Response) {
    console.log(photo);
    return await this.hotelService.registerHotel(dto, photo, res);
  }



  @Post('/login')
  async loginHotel(
    @Body() dto: LoginHotelDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return await this.hotelService.loginHotel(dto, req, res);
  }

  @UseGuards(HotelAuthGuard)
  @Patch('/mine/update')
  async updateHotelDetails(
    @GetHotel() hotelId: string,
    @Body() dto: UpdateHotelDto,
    @Res() res: Response,
  ) {
    return await this.hotelService.updateHotelDetails(hotelId, dto, res);
  }
  // Routes to reset password
  @UseGuards(HotelAuthGuard)
  @Patch('/auth/check-old-password')
  async checkOldPassword(
    @Body() dto: checkOldPasswordDto,
    @GetHotel() hotelId: string,
    @Res() res: Response,
  ) {
    return await this.hotelService.checkOldPassword(dto, hotelId, res);
  }

  @UseGuards(HotelAuthGuard)
  @Patch('/auth/reset-password')
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @GetHotel() hotelId: string,
    @Res() res: Response,
  ) {
    return await this.hotelService.resetPassword(dto, hotelId, res);
  }

  @UseGuards(HotelAuthGuard)
  @Post('/logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    return await this.hotelService.logout(req, res);
  }

}

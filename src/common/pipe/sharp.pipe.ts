import { Injectable, PipeTransform } from '@nestjs/common';
import sizeOf from 'image-size';
import * as path from 'path';
import * as sharp from 'sharp';
import * as fs from 'fs';

@Injectable()
export class SharpPipe implements PipeTransform<Express.Multer.File, Promise<string>> {
  async transform(image: Express.Multer.File): Promise<string> {
    const dimensions = await sizeOf(image.buffer);
    const originalName = path.parse(image.originalname).name;
    const filename = Date.now() + '-' + originalName + '.webp';
    const pathImage = './uploads';
    fs.mkdirSync(pathImage, { recursive: true });
    await sharp(image.buffer).resize(dimensions.width).webp({ effort: 3 }).toFile(path.join('uploads', filename));

    return filename;
  }
}

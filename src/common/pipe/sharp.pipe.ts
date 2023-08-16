import { Injectable, PipeTransform } from '@nestjs/common';
import sizeOf from 'image-size';
import * as path from 'path';
import * as sharp from 'sharp';
import * as fs from 'fs';
import { S3 } from 'aws-sdk';

@Injectable()
export class SharpPipe implements PipeTransform<Express.Multer.File, Promise<{ name: string; url: string }>> {
  async transform(image: Express.Multer.File): Promise<{ name: string; url: string }> {
    const dimensions = await sizeOf(image.buffer);
    const originalName = path.parse(image.originalname).name;
    const filename = Date.now() + '-' + originalName + '.webp';

    if (process.env.AWS_ACCESS_KEY_ID) {
      const buffer = await sharp(image.buffer).resize(dimensions.width).webp({ effort: 3 }).toBuffer();
      return new Promise((resolve, reject) => {
        new S3({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }).upload(
          {
            Bucket: process.env.AWS_ACCESS_BUCKET_NAME + '/avata-dev',
            Key: filename,
            Body: buffer,
          },
          (err, data) => {
            if (err) {
              console.log(err);
              reject(err.message);
            }
            console.log(data);
            resolve({ name: filename, url: data.Location });
          },
        );
      });
    } else {
      const pathImage = './uploads';
      fs.mkdirSync(pathImage, { recursive: true });
      await sharp(image.buffer).resize(dimensions.width).webp({ effort: 3 }).toFile(path.join('uploads', filename));
      return { name: filename, url: process.env.DOMAIN + 'files/' + filename };
    }
  }
}

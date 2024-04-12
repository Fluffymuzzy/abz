import { HttpService } from "@nestjs/axios";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as sharp from "sharp";
import { promises as fs } from "fs";

@Injectable()
export class PhotoService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService
  ) {}

  private readonly tinify_key = this.configService.get<string>(
    "TINIFY_API_KEY"
  );
  // --------------------------------------------------------------------
  async processAndSavePhoto(
    photoUrl: string | undefined,
    photoBuffer: Buffer | undefined
  ): Promise<string> {
    if (!photoUrl && !photoBuffer) {
      throw new HttpException(
        { success: false, message: "No photo provided" },
        HttpStatus.BAD_REQUEST
      );
    }

    let buffer: Buffer;
    if (photoUrl && this.isValidUrl(photoUrl)) {
      buffer = await this.downloadPhoto(photoUrl);
    } else {
      buffer = photoBuffer;
    }

    const optimizedBuffer = await this.optimizePhoto(buffer);
    const uploadedPhotoUrl = await this.savePhoto(optimizedBuffer);

    return uploadedPhotoUrl;
  }
  // --------------------------------------------------------------------
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }
  // --------------------------------------------------------------------
  private async downloadPhoto(url: string): Promise<Buffer> {
    try {
      const response = await this.httpService.axiosRef.get(url, {
        responseType: "arraybuffer",
      });
      return Buffer.from(response.data);
    } catch (_) {
      throw new HttpException(
        { success: false, message: "Error downloading photo from URL" },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  // --------------------------------------------------------------------
  private async optimizePhoto(photoBuffer: Buffer): Promise<Buffer> {
    const resizedBuffer = await sharp(photoBuffer)
      .resize(70, 70, { fit: "cover" })
      .toBuffer();

    try {
      const response = await this.httpService.axiosRef.post(
        "https://api.tinify.com/shrink",
        resizedBuffer,
        {
          auth: { username: "api", password: this.tinify_key },
          responseType: "json",
          maxContentLength: 5 * 1024 * 1024, 
        }
      );

      if (response.data.output.size > 5 * 1024 * 1024) {
        throw new Error("Optimized photo exceeds size limit of 5MB");
      }

      const optimizedPhotoResponse = await this.httpService.axiosRef.get(
        response.data.output.url,
        {
          responseType: "arraybuffer",
        }
      );

      return Buffer.from(optimizedPhotoResponse.data);
    } catch (_) {
      throw new HttpException(
        { success: false, message: "Error optimizing photo" },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  // --------------------------------------------------------------------
  private async savePhoto(photoBuffer: Buffer): Promise<string> {
    const fileName = `${Date.now()}.jpg`;
    const filePath = `uploads/${fileName}`;
    await fs.writeFile(filePath, photoBuffer);

    const fileUrl = `http://localhost:3000/uploads/${fileName}`;
    return fileUrl;
  }
}

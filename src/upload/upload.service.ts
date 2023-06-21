import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(private readonly config: ConfigService) {}
  private readonly s3Client = new S3Client({ region: this.config.getOrThrow('AWS_REGION') });

  async upload(filename: string, file: Buffer) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.config.getOrThrow('AWS_S3_BUCKET_NAME'),
        Key: filename,
        Body: file,
      }),
    );
  }

  async delete(filename: string) {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.config.getOrThrow('AWS_S3_BUCKET_NAME'),
        Key: filename,
      }),
    );
  }
}

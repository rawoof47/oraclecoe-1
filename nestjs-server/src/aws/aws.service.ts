import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AwsService {
  private readonly s3: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor() {
    this.bucketName = process.env.AWS_S3_BUCKET!;
    this.region = process.env.AWS_REGION!;

    this.s3 = new S3Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async uploadProfilePic(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file size (max 1MB)
    if (file.size > 1 * 1024 * 1024) {
      throw new BadRequestException('File size exceeds 1MB limit');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only JPG, PNG, and WEBP images are allowed');
    }

    const fileExt = extname(file.originalname);
    const uniqueName = `profile-pics/${uuidv4()}${fileExt}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: uniqueName,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3.send(command);

      return `https://s3.amazonaws.com/${this.bucketName}/${uniqueName}`;;
    } catch (error) {
      console.error('S3 Upload Error:', error);
      throw new InternalServerErrorException('Failed to upload image to S3');
    }
  }

  async uploadCompanyLogo(file: Express.Multer.File): Promise<string> {
  if (!file) {
    throw new BadRequestException('No file provided');
  }

  // Validate file size (max 1MB)
  if (file.size > 1 * 1024 * 1024) {
    throw new BadRequestException('File size exceeds 1MB limit');
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.mimetype)) {
    throw new BadRequestException('Only JPG, PNG, and WEBP images are allowed');
  }

  const fileExt = extname(file.originalname);
  const uniqueName = `company-logos/${uuidv4()}${fileExt}`; // ✅ Use company-logos folder

  try {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: uniqueName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3.send(command);

    return `https://s3.amazonaws.com/${this.bucketName}/${uniqueName}`; // ✅ Use correct public URL
  } catch (error) {
    console.error('S3 Upload Error:', error);
    throw new InternalServerErrorException('Failed to upload company logo');
  }
}

// aws.service.ts

async uploadResume(file: Express.Multer.File): Promise<string> {
  if (!file) {
    throw new BadRequestException('No file provided');
  }

  // ✅ Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    throw new BadRequestException('File size exceeds 2MB limit');
  }

  // ✅ Validate file type (PDF, DOC, DOCX)
  const allowedTypes = [
    'application/pdf',
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    throw new BadRequestException('Only PDF, DOC, and DOCX files are allowed');
  }

  const fileExt = extname(file.originalname); // .pdf / .doc / .docx
  const uniqueName = `resumes/${uuidv4()}${fileExt}`;

  try {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: uniqueName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3.send(command);

    return `https://s3.amazonaws.com/${this.bucketName}/${uniqueName}`;
  } catch (error) {
    console.error('S3 Upload Error:', error);
    throw new InternalServerErrorException('Failed to upload resume to S3');
  }
}


}

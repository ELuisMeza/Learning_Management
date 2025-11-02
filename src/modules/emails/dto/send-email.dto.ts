import { IsEmail, IsNotEmpty, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AttachmentDto {
  @IsString()
  filename: string;

  @IsOptional()
  @IsString()
  path?: string;

  @IsOptional()
  content?: Buffer | string;

  @IsOptional()
  @IsString()
  contentType?: string;
}

export class SendEmailDto {
  @IsNotEmpty()
  @IsEmail({}, { each: true })
  @IsArray()
  to: string[];

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsOptional()
  @IsString()
  html?: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];
}


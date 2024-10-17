import { BadRequestException } from '@nestjs/common';
import { covertByteToMB } from '../utils/file.util';
import { join } from 'path';
import { publicFolder } from '../configs/file-default.config';
import { accessSync, mkdirSync } from 'fs';

export function validateFile(options: {
  allowedMimeTypes: string[];
  maxSize: number;
}) {
  return (_, file: any, callback: any) => {
    const { allowedMimeTypes, maxSize } = options;

    // Kiểm tra MIME type
    if (
      !allowedMimeTypes.some((mimeType) => file.mimetype.includes(mimeType))
    ) {
      return callback(
        new BadRequestException(
          `Chỉ cho phép các tệp ${allowedMimeTypes.join(', ')}`,
        ),
        false,
      );
    }

    // Kiểm tra kích thước file
    console.log(`File size: ${JSON.stringify(file)} bytes`); // Log kích thước file
    if (file.size > maxSize) {
      return callback(
        new BadRequestException(
          `Kích thước tệp vượt quá giới hạn ${covertByteToMB(maxSize)}MB!`,
        ),
        false,
      );
    }

    // Nếu hợp lệ
    callback(null, true);
  };
}

export function ensureDirectoryExistence(
  filePath: string,
  baseDir: string = publicFolder,
) {
  const dir = join(__dirname, '../../..', baseDir, filePath); // Đường dẫn tuyệt đối đến thư mục
  try {
    accessSync(dir); // Kiểm tra xem thư mục có tồn tại không
  } catch {
    mkdirSync(dir, { recursive: true }); // Tạo thư mục nếu không tồn tại
  } finally {
    return dir;
  }
}

import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  ensureDirectoryExistence,
  validateFile,
} from '../validate/file.validate';
import { uploadsFolder } from './file-default.config';
import { MulterModuleOptions } from '@nestjs/platform-express';

export function multerConfig(options: {
  allowedMimeTypes: string[];
  maxSize: number;
}): MulterModuleOptions {
  const pathdestination = ensureDirectoryExistence(uploadsFolder);

  return {
    storage: diskStorage({
      destination: pathdestination,
      filename: (_, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: validateFile(options),
    limits: {
      fileSize: options.maxSize, // Giới hạn kích thước file
    },
  };
}

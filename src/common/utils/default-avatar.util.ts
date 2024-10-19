import { accessSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { defaultFolder, publicFolder } from '../configs/file-default.config';

const basePathPublic = join(__dirname, '../../..', publicFolder);

export const defaultAvatar = () => {
  const listImages = readdirSync(join(basePathPublic, defaultFolder));
  const randomIndex = Math.floor(Math.random() * listImages.length);
  const fileName = listImages?.[randomIndex];
  return `${defaultFolder}/${fileName}`;
};

export const checkRemoveFilePathDefault = (path: string) => {
  const newPath = join(basePathPublic, path);
  const isDefault = path?.startsWith(defaultFolder);
  try {
    if (isDefault) return;
    accessSync(newPath); // Kiểm tra nếu file tồn tại
    unlinkSync(newPath); // Xóa file
  } catch {}
};

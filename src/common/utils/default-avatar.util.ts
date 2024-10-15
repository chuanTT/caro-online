import { readdirSync } from 'fs';
import { join } from 'path';
import { defaultFolder, publicFolder } from '../configs/file-default.config';

export const defaultAvatar = () => {
  const listImages = readdirSync(
    join(__dirname, '../../..', publicFolder, defaultFolder),
  );
  const randomIndex = Math.floor(Math.random() * listImages.length);
  const fileName = listImages?.[randomIndex];
  return `${defaultFolder}/${fileName}`;
};

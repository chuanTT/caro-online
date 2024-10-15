import { createHash } from 'crypto';

export const hashHexSha256 = (token: string): string => {
  return createHash('sha256').update(token).digest('hex'); // Sử dụng SHA-256 để băm token
};

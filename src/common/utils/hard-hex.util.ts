import { createHash, randomBytes } from 'crypto';

export const hashHexSha256 = (token: string): string => {
  return createHash('sha256').update(token).digest('hex'); // Sử dụng SHA-256 để băm token
};

export const generateRandomString = (length) => {
  return randomBytes(length)
    .toString('hex') // Chuyển đổi byte thành chuỗi hex
    .slice(0, length) // Cắt chuỗi để chỉ lấy 8 ký tự
    .toUpperCase(); // Chuyển thành chữ hoa (tuỳ chọn)
};

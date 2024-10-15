import { compareSync, hashSync } from 'bcrypt';

export const hashPassSync = (password: string) => {
  const saltRounds = 10;
  return hashSync(password, saltRounds);
};

export const comparePassword = (password: string, hashedPassword: string) => {
  return compareSync(password, hashedPassword);
};

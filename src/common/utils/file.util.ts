export const covertMBToByte = (mb: number) => {
  return mb * 1024 * 1024;
};

export const covertByteToMB = (mb: number) => {
  return mb / (1024 * 1024);
};

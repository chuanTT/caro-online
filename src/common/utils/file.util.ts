export const covertMBToByte = (mb: number) => {
  return mb * Math.pow(1024, 2);
};

export const covertByteToMB = (mb: number) => {
  return mb / Math.pow(1024, 2);
};

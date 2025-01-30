export const verifyImageUri = (itemImage: string) => {
  return itemImage
    ? { uri: itemImage }
    : require("@/assets/fotos-uniformes.jpg");
};
function generateRandomKey() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";

  for (let i = 0; i < 32; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    key += characters.charAt(randomIndex);
  }

  return key;
}

export default generateRandomKey;

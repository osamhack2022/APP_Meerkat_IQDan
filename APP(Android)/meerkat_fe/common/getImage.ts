export const getImage = (img: string | null) => {
  if (img === null) {
    return require('../assets/users/emptyProfile.jpg');
  }
  return {uri: img};
};

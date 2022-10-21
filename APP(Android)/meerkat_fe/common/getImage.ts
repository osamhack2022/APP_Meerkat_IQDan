export const getImage = (img: string | null) => {
  if (img === null) {
    return require('../assets/users/emptyProfile.png');
  }
  return {uri: img};
};

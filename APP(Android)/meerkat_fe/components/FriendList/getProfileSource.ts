/**
 * @param image must be delivered as 'require('image path')'
 * @returns empty profile if 'image' is null or undefined, else image.
 */
export default function getProfileSource(image: any){
    const ProfileImageSource =
    (image === null || image == undefined)
      ? require("../../assets/users/emptyProfile.jpg")
      : image;
    return ProfileImageSource;
}
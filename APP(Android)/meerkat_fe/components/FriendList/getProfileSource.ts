import isEmpty from "../../common/isEmpty";

/**
 * @param image must be delivered as 'require('image path')'
 * @returns empty profile if 'image' is null or undefined, else image.
 */
export default function getProfileSource(image: any){
    const ProfileImageSource =
    isEmpty(image)
      ? require("../../assets/users/emptyProfile.jpg")
      : image;
    return ProfileImageSource;
}
import { URI } from "../enums/enum";

const getImageFromServer = (root: string, dir: string, imagePath: string) => {
  return `${URI.API_URI}/${root}/${dir}/${imagePath}`;
};

export default getImageFromServer;

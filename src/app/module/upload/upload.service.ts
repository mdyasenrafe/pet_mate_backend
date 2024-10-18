import axios from "axios";
import config from "../../../config";
import { TUpload } from "./upload.types";

const uploadFileToCloud = async (payload: TUpload) => {
  let url = `https://api.cloudinary.com/v1_1/${config.cloudinary_cloud_name}/upload`;
  const response = await axios.post(url, payload);
  return {
    url: response.data.url,
    secure_url: response.data.secure_url,
    ...response.data,
  };
};

export const uploadServices = {
  uploadFileToCloud,
};

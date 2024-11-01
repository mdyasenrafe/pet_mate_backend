import dotenv from "dotenv";
import Stripe from "stripe";
dotenv.config();

export default {
  port: process.env.PORT,
  database_url: process.env.database_url,
  NODE_ENV: process.env.NODE_ENV,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  cloudinary_api_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
};

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

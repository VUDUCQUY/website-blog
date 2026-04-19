import fs from "fs/promises";
import cloudinary from "@/config/cloudinary.config";

const AVATAR_FOLDER = "website-blog/avatars";

export type CloudinaryAvatar = {
   secureUrl: string;
   publicId: string;
};

export const uploadAvatarToCloudinary = async (filePath: string): Promise<CloudinaryAvatar> => {
   try {
      const result = await cloudinary.uploader.upload(filePath, {
         folder: AVATAR_FOLDER,
         resource_type: "image",
      });

      return {
         secureUrl: result.secure_url,
         publicId: result.public_id,
      };
   } finally {
      // Multer stores a temp local file; remove it after upload attempt.
      await fs.unlink(filePath).catch(() => undefined);
   }
};

export const deleteAvatarFromCloudinary = async (publicId: string): Promise<void> => {
   await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
   });
};

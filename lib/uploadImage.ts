import { ID, storage } from "@/appwrite";

const uploadImage = async (file: File) => {
  if (!file) return;

  const fileUploaded = await storage.createFile(
    process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID as string,
    ID.unique() as string,
    file
  );
  return fileUploaded;
};
export default uploadImage;

import multer from 'multer';   

import { v4 as uuid} from "uuid"

const MAX_IMAGE_SIZE = 1024 * 1024 * 10;
const allowedImageTypes = new Set([
  "image/avif",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const fileFilter: multer.Options["fileFilter"] = (req, file, callback) => {
  if (!allowedImageTypes.has(file.mimetype)) {
    callback(new Error("Only image uploads are allowed"));
    return;
  }

  callback(null, true);
};

const storage = multer.diskStorage({
    destination(req, file, callback){
    callback(null, "uploads");
},
filename(req, file, callback){
    const id = uuid();
    const extName = file.originalname.split(".").pop();
    const fileName = `${id}.${extName}`
    callback(null, fileName);
}
});


export const singlUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_IMAGE_SIZE },
}).single("photo");

export const multiUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_IMAGE_SIZE },
}).array("photos", 10);


import multer from 'multer';   

import { v4 as uuid} from "uuid"
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


export const singlUpload = multer({ storage }).single("photo");

export const multiUpload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 10 },
}).array("photos", 10);


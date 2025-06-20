import multer, { Field, FileFilterCallback } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import fs from 'fs';
// Define __dirname
import { Request } from 'express';
const __filename = fileURLToPath(import.meta.url);

const uploadPath = path.join(path.dirname(__filename), '..', 'uploads'); // Adjust as needed

if (!fs.existsSync(uploadPath)) {
	fs.mkdirSync(uploadPath, { recursive: true });
}

const uploadFile = () => {
	const storage = multer.diskStorage({
		destination: (req: Request, file: Express.Multer.File, cb) => {
			try {
				cb(null, uploadPath);
			} catch (err) {
				if (err instanceof Error) {
					cb(
						new Error(`Error setting destination: ${err.message}`),
						uploadPath
					);
				}
			}
		},
		filename: (
			req: Request,
			file: Express.Multer.File,
			cb: (error: Error | null, destination: string) => void
		) => {
			try {
				cb(null, uuidv4() + '_' + file.originalname);
			} catch (err: unknown) {
				if (err instanceof Error) {
					cb(
						new Error(`Error generating filename: ${err.message}`),
						file.originalname
					);
				}
			}
		},
	});

	function fileFilter(
		req: Request,
		file: Express.Multer.File,
		cb: FileFilterCallback
	) {
		if (file.mimetype.startsWith('image')) {
			return cb(null, true);
		}

		cb(new Error('invalid image type'));
	}

	const upload = multer({
		storage,
		fileFilter,
	});

	return upload;
};

const uploadSingle = (fieldName: string) => uploadFile().single(fieldName);
const uploadArray = (fieldName: string) => uploadFile().array(fieldName, 10);

const uploadFields = (fieldslist: Field[]) => uploadFile().fields(fieldslist);

export { uploadSingle, uploadArray, uploadFields };

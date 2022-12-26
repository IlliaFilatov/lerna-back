// import { TUploadableMedia } from 'twitter-api-v2/dist/types';
// import fs from 'fs';

export class UploadMediaDto {
  readonly file: Express.Multer.File;
  readonly message: string;
}

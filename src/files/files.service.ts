import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  createReferenceFiles(files: Express.Multer.File[], id: string) {
    console.log(files, id);
    return 'This action adds a new file';
  }

  createIncludesFiles(files: Express.Multer.File[], id: string) {
    console.log(files, id);
    return 'This action adds a new file';
  }
}

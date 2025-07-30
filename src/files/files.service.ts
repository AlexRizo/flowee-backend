import { Injectable } from '@nestjs/common';
import { UpdateFileDto } from './dto/update-file.dto';

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

  findAll() {
    return `This action returns all files`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}

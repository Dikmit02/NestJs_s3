// import {
//   Controller,
//   Get,
//   Param,
//   Post,
//   Res,
//   UploadedFile,
//   UseInterceptors,
//   Delete,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { v4 as uuidv4 } from 'uuid';
// import { diskStorage } from 'multer';
// import { extname } from 'path';
// import { FilesService } from './files.service';
// import { Response } from 'express';

// @Controller('files')
// export class FilesController {
//   constructor(private readonly filesService: FilesService) {}

//   @Post()
//   @UseInterceptors(
//     FileInterceptor('file', {
//       storage: diskStorage({
//         destination: './uploads',
//         filename: (req, file, cb) => {
//           const randomName = uuidv4();
//           return cb(null, `${randomName}${extname(file.originalname)}`);
//         },
//       }),
//     }),
//   )
//   async uploadFile(@UploadedFile() file) {
//     const response = {
//       originalname: file.originalname,
//       filename: file.filename,
//     };
//     return response;
//   }

//   @Get()
//   async listFiles() {
//     const files = await this.filesService.listFiles();
//     return files;
//   }

//   @Get(':filename')
//   async getFile(@Param('filename') filename: string, @Res() res: Response) {
//     const buffer = await this.filesService.getFile(filename);
//     res.set('Content-Type', 'application/octet-stream');
//     res.send(buffer);
//   }

//   @Delete(':filename')
//   async deleteFile(@Param('filename') filename: string) {
//     await this.filesService.deleteFile(filename);
//     return {
//       message: 'File Deleted Successfully',
//     };
//   }
// }

import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './files.service';

@Controller('buckets')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  listBuckets(): string[] {
    return this.fileService.listBuckets();
  }

  @Get(':bucket')
  listObjects(@Param('bucket') bucket: string): string[] {
    return this.fileService.listObjects(bucket);
  }

  @Get(':bucket/:objectKey')
  getObject(
    @Param('bucket') bucket: string,
    @Param('objectKey') objectKey: string,
  ): Buffer {
    return this.fileService.getObject(bucket, objectKey);
  }

  @Post(':bucket/:objectKey')
  @UseInterceptors(FileInterceptor('file'))
  putObject(
    @Param('bucket') bucket: string,
    @Param('objectKey') objectKey: string,
    @UploadedFile() file,
  ): void {
    this.fileService.putObject(bucket, objectKey, file);
  }

  @Get(':bucket/:objectKey/delete')
  deleteObject(
    @Param('bucket') bucket: string,
    @Param('objectKey') objectKey: string,
  ): void {
    this.fileService.deleteObject(bucket, objectKey);
  }
}

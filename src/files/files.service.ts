// import { Injectable } from '@nestjs/common';
// import * as fs from 'fs';
// import * as path from 'path';

// @Injectable()
// export class FilesService {
//   private readonly uploadFolder = './uploads';

//   async listFiles(): Promise<string[]> {
//     return new Promise((resolve, reject) => {
//       fs.readdir(this.uploadFolder, (err, files) => {
//         err ? reject(err) : resolve(files);
//       });
//     });
//   }

//   async getFile(filename: string): Promise<Buffer> {
//     return new Promise((resolve, reject) => {
//       fs.readFile(path.join(this.uploadFolder, filename), (err, data) => {
//         err ? reject(err) : resolve(data);
//       });
//     });
//   }

//   async deleteFile(filename: string): Promise<void> {
//     return new Promise((resolve, reject) => {
//       fs.unlink(path.join(this.uploadFolder, filename), (err) => {
//         err ? reject(err) : resolve();
//       });
//     });
//   }
// }

import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  private readonly storagePath = './uploads';

  listBuckets(): string[] {
    const buckets = fs
      .readdirSync(this.storagePath)
      .filter((item) =>
        fs.lstatSync(path.join(this.storagePath, item)).isDirectory(),
      );
    return buckets;
  }

  listObjects(bucket: string): string[] {
    const objects = fs.readdirSync(path.join(this.storagePath, bucket));
    return objects;
  }

  getObject(bucket: string, objectKey: string): Buffer {
    const objectPath = path.join(this.storagePath, bucket, objectKey);
    const fileData = fs.readFileSync(objectPath);
    return fileData;
  }

  putObject(bucket: string, objectKey: string, file): void {
    const bucketPath = path.join(this.storagePath, bucket);
    if (!fs.existsSync(bucketPath)) {
      fs.mkdirSync(bucketPath);
    }
    const objectPath = path.join(bucketPath, objectKey);
    fs.writeFileSync(objectPath, file.buffer);
  }

  deleteObject(bucket: string, objectKey: string): void {
    const objectPath = path.join(this.storagePath, bucket, objectKey);
    fs.unlinkSync(objectPath);
  }
}

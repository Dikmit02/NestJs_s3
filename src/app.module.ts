import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileController } from './files/files.controller';
import { FileService } from './files/files.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // specify the destination directory for uploaded files
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class AppModule {}

import { Module } from '@nestjs/common';  
import { BullModule } from '@nestjs/bull'; 
import { MulterModule } from '@nestjs/platform-express'; 
import { FileController } from './file.controller';
import { FileResolver } from './file.resolver'; 
import { FileService } from './file.service';
import { FileProcessor } from './file.processor'; 
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { FileEntity } from './file-entity.entity';
import { BatchGateway } from '../batch-gateway/batch.gateway'; 

@Module({
  imports: [
    // Configure MulterModule for handling file uploads
    MulterModule.register({
      dest: './uploads',  // Directory where uploaded files will be stored
    }),
   
    TypeOrmModule.forFeature([FileEntity]),
   
    BullModule.registerQueue({
      name: 'file-processing', 
    }),
  ],
  controllers: [FileController],  // Register the FileController to handle HTTP requests
  providers: [
    FileService,  
    FileResolver, 
    FileProcessor,  
    BatchGateway,  
  ],
})
export class FileModule {}  // Define the FileModule class

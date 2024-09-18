import { Process, Processor } from '@nestjs/bull'; 
import { Job } from 'bull';  
import { InjectRepository } from '@nestjs/typeorm';  
import { Repository } from 'typeorm';  
import { FileEntity } from './file-entity.entity';
import { BatchGateway } from '../batch-gateway/batch.gateway'; 

@Processor('file-processing') // Define the processor and queue name for Bull.js
export class FileProcessor {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,  // Injecting the FileEntity repository for DB operations
    private readonly batchGateway: BatchGateway,  // Injecting the WebSocket gateway to send notifications
  ) {}

  // This method handles processing of CSV file jobs
  @Process('process-csv')
  async handleFileProcessing(job: Job) {
    const records = job.data;  
    const batchSize = 100;  

    // Process the CSV records in batches of 100
    for (let i = 0; i < records.length; i += batchSize) {
      const batchData = records.slice(i, i + batchSize); 

      // Save the batch data into the database
      await this.fileRepository.save(batchData);

      console.log(`Processed batch ${i / batchSize + 1}`);
    }

    this.batchGateway.notifyBatchComplete('Batch processing completed successfully.');
  }
}

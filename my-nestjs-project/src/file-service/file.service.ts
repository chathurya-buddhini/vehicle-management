import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; 
import { FileEntity } from './file-entity.entity'; 
import { FileType } from './file.type'; 
import * as csv from 'csv-parser'; 
import { createReadStream } from 'fs'; 
import { Repository, Like } from 'typeorm'; 
import { plainToInstance } from 'class-transformer';


@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>, // Inject the TypeORM repository for FileEntity
  ) {}

  // Get all file records from the database
  async getAll(): Promise<FileEntity[]> {
    return await this.fileRepository.find(); // Use find() to retrieve all records
  }

  // Upload and process a CSV file
  async uploadFile(filePath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      createReadStream(filePath) // Create a readable stream from the file path
        .pipe(csv()) // Pipe the stream through csv-parser
        .on('data', async (row) => {
          try {
            const fileEntity = this.mapRowToFileEntity(row); // Map CSV row to FileEntity instance
            await this.fileRepository.save(fileEntity); // Save the entity to the database
          } catch (error) {
            console.error('Error saving row:', error); // Log any errors
          }
        })
        .on('end', () => {
          console.log('CSV file processing completed'); // Log when processing is complete
          resolve(true); // Resolve the promise indicating success
        })
        .on('error', (error) => {
          console.error('Error processing CSV file:', error); // Log errors
          reject(new Error('Error processing CSV file: ' + error.message)); // Reject the promise with an error message
        });
    });
  }

  // Map a row of CSV data to a FileEntity instance
  private mapRowToFileEntity(row: any): FileEntity {
    return this.fileRepository.create({
      first_name: row['first_name'] || '',
      last_name: row['last_name'] || '',
      email: row['email'] || '',
      car_make: row['car_make'] || '',
      car_model: row['car_model'] || '',
      vin: row['vin'] || '',
      manufactureDate: row['manufactured_date'] || '',
      age_of_vehicle: row['age_of_vehicle'] || '',
    });
  }

  // Update a file record by ID with new data
  async updateFile(id: number, updateData: Partial<FileEntity>): Promise<FileEntity> {
    const file = await this.fileRepository.findOne({
      where: { id }, 
    });
    if (!file) {
      throw new Error('File not found'); 
    }
    Object.assign(file, updateData); 
    return this.fileRepository.save(file);
  }

  // Delete a file record by ID
  async deleteFile(id: number): Promise<void> {
    const result = await this.fileRepository.delete(id); 
    if (result.affected === 0) {
      throw new Error('File not found'); 
    }
  }

  // Search for files matching a search term
  async searchFiles(term: string): Promise<FileEntity[]> {
    return this.fileRepository.createQueryBuilder('file')
      .where('file.first_name LIKE :term', { term: `%${term}%` })
      .orWhere('file.last_name LIKE :term', { term: `%${term}%` })
      .orWhere('file.email LIKE :term', { term: `%${term}%` })
      .orWhere('file.car_make LIKE :term', { term: `%${term}%` })
      .orWhere('file.car_model LIKE :term', { term: `%${term}%` })
      .orWhere('file.vin LIKE :term', { term: `%${term}%` })
      .orWhere('file.manufactureDate LIKE :term', { term: `%${term}%` })
      .orWhere('file.age_of_vehicle LIKE :term', { term: `%${term}%` })
      .getMany(); // Perform a wildcard search on various fields
  }

  // Get vehicles older than a specified number of years
  async getVehiclesOlderThan(panthalinYears: number): Promise<FileEntity[]> {
    const currentDate = new Date();
    const thresholdDate = new Date();
    thresholdDate.setFullYear(currentDate.getFullYear() - panthalinYears); // Calculate the threshold date based on the input years
    
    return this.fileRepository.createQueryBuilder('file')
      .where('file.manufactureDate < :thresholdDate', { thresholdDate })
      .getMany(); // Retrieve files with manufacture dates older than the threshold date
  }

  // List members with pagination
  async listMembers(page: number, pageSize: number): Promise<{ data: FileEntity[], totalRecords: number }> {
    const [data, totalRecords] = await this.fileRepository.findAndCount({
      order: { manufactureDate: 'ASC' },  
      skip: (page - 1) * pageSize,        
      take: pageSize,                     
    });
    
    return { data, totalRecords }; 
  }

 /* async listMembers(limit?: number, offset?: number): Promise<FileType[]> {
    // Set default values if not provided
    limit = limit ?? 100; // Default to 100 if limit is not provided
    offset = offset ?? 0; // Default to 0 if offset is not provided

    // Fetch vehicles with pagination
    const vehicleList: FileEntity[] = await this.fileRepository.find({
      order: {
        manufactureDate: 'ASC',
      },
      take: limit, // Limit number of items
      skip: offset, // Skip items based on offset
    });

    return plainToInstance(FileType, vehicleList);
  }*/
  
}


import { Controller, Get, Post, Query, UploadedFile, UseInterceptors, Body, Put, Delete, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'; 
import { createReadStream } from 'fs'; 
import { FileService } from './file.service'; 
import { FileEntity } from './file-entity.entity'; 
import { FileType } from './file.type'; 

@Controller('files') // Define the base route for this controller.
export class FileController {
  private parsedResults = []; // A placeholder for parsed CSV results

  constructor(private readonly fileService: FileService) {} 

  // Fetch all files stored in the database.
  @Get('getall')
  async getAllFiles(): Promise<FileEntity[]> {
    return this.fileService.getAll(); 
  }

  // Endpoint to upload and process a CSV file.
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { 
    // Multer storage settings for saving the file locally
    storage: diskStorage({
      destination: './uploads/csv', 
      filename: (req, file, callback) => {
        const fileName = `${Date.now()}-${file.originalname}`; 
        callback(null, fileName); 
      },
    }),
  }))
  async uploadFile(@UploadedFile() file) { 
    if (!file) {
      throw new Error('No file uploaded'); // Error if no file is uploaded.
    }

    // Pass the file path to the service to process the file.
    await this.fileService.uploadFile(file.path);

    return { 
      totalRecords: this.parsedResults.length, 
      message: 'File uploaded and processing started' 
    };
  }

  // Update a specific file's data by ID.
  @Put(':id')
  async updateFile(@Param('id') id: number, @Body() updateData: Partial<FileEntity>) {
    return this.fileService.updateFile(id, updateData); 
  }

  // Delete a specific file by ID.
  @Delete(':id')
  async deleteFile(@Param('id') id: number) {
    await this.fileService.deleteFile(id); 
    return { message: 'File deleted successfully' };
  }

  // Search for files containing a specific search term.
  @Get('search')
  async searchFiles(@Query('term') term: string): Promise<FileEntity[]> {
    if (!term) {
      throw new Error('Search term is required'); 
    }
    return this.fileService.searchFiles(term); 
  }

  // Fetch vehicles older than a specified number of years.
  @Get('older-than')
  async getVehiclesOlderThan(@Query('years') years: number): Promise<FileEntity[]> {
    if (!years || isNaN(years)) {
      throw new Error('Please provide a valid number of years.'); 
    }
    return this.fileService.getVehiclesOlderThan(years); 
  }

  // List paginated members with server-side pagination.
  @Get('list')
  async listMembers(
    @Query('page') page: number = 1, 
    @Query('pageSize') pageSize: number = 100 
  ): Promise<{ currentPage: number, totalRecords: number, totalPages: number, data: FileEntity[] }> {
    const { data, totalRecords } = await this.fileService.listMembers(page, pageSize); // Fetch paginated data

    return {
      currentPage: page, 
      totalRecords, 
      totalPages: Math.ceil(totalRecords / pageSize), 
      data, 
    };
  }

  /*@Get()
  async listMembers(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ): Promise<FileType[]> {
    return this.fileService.listMembers(limit, offset);
  }
}*/

}

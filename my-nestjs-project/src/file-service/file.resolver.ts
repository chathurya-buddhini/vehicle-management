import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';  
import { FileService } from './file.service';
import { FileType } from './file.type'; 
import { FileEntity } from './file-entity.entity'; 
import { UpdateFileInput } from './update-file.input'; 

@Resolver(() => FileType) // Define the resolver for FileType
export class FileResolver {
  constructor(private readonly fileService: FileService) {} 

  // Mutation for updating a file record
  @Mutation(() => FileType)
  async updateFile(
    @Args('updateData') updateData: UpdateFileInput, 
  ): Promise<FileType> {
    return this.fileService.updateFile(updateData.id, updateData); 
  }

  // Mutation for deleting a file record
  @Mutation(() => Boolean)
  async deleteFile(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.fileService.deleteFile(id);
    return true; 
  }

  // Query for searching files based on a search term
  @Query(() => [FileType])
  async searchFiles(@Args('term', { type: () => String }) term: string): Promise<FileType[]> {
    return this.fileService.searchFiles(term); 
  }

  // Query for listing members with pagination
  @Query(() => [FileType])
  async listMembers(
    @Args('page', { type: () => Int }) page: number = 1, 
    @Args('pageSize', { type: () => Int }) pageSize: number = 100, 
  ) {
    const { data } = await this.fileService.listMembers(page, pageSize); 
    return data;
  }


  /*@Query(() => [FileType], { name: 'files' })
  async findAll(
      @Args('limit', { type: () => Number, nullable: true }) limit?: number,
      @Args('offset', { type: () => Number, nullable: true }) offset?: number
  ): Promise<FileType[]> {
    return this.fileService.listMembers(limit, offset);
  }*/
}

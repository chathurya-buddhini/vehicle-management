import { ObjectType, Field, Int } from '@nestjs/graphql';  // Import necessary decorators from @nestjs/graphql

// Define an object type for GraphQL queries or responses
@ObjectType()
export class FileType {
  

  @Field(() => Int)
  id: number;


  @Field(() => String, { nullable: true })
  someField?: string;


  @Field()
  manufactureDate: Date;


  @Field(() => Int)
  age_of_vehicle: number;
}

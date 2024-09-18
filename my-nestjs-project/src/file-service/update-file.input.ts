import { InputType, Field, Int } from '@nestjs/graphql';  // Import necessary decorators from @nestjs/graphql

// Define an input type for GraphQL mutations or queries
@InputType()
export class UpdateFileInput {
  
  
  @Field(() => Int)
  id: number;


  @Field({ nullable: true })
  first_name?: string;


  @Field({ nullable: true })
  last_name?: string;


  @Field({ nullable: true })
  email?: string;


  @Field({ nullable: true })
  car_make?: string;


  @Field({ nullable: true })
  car_model?: string;

 
  @Field({ nullable: true })
  vin?: string;

 
  @Field({ nullable: true })
  manufactureDate?: Date;


  @Field({ nullable: true })
  age_of_vehicle?: number;
}

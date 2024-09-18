
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType() 
@Entity() 
export class FileEntity {

  // It is also exposed as an integer field in GraphQL schema.
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;


  @Field(() => String)
  @Column({ nullable: false }) 
  first_name: string;


  @Field(() => String)
  @Column({ nullable: false })
  last_name: string;

  
  @Field(() => String)
  @Column({ nullable: false })
  email: string;

 
  @Field(() => String)
  @Column({ nullable: false })
  car_make: string;

 
  @Field(() => String)
  @Column({ nullable: false })
  car_model: string;

  
  @Field(() => String)
  @Column({ nullable: false })
  vin: string;


  @Field(() => Date)
  @Column({ nullable: true })
  manufactureDate: Date;

  
  @Field(() => Int)
  @Column({ nullable: true })
  age_of_vehicle: number;

}

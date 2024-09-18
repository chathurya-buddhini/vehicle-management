import { Module } from '@nestjs/common'; 
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'; 
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { FileEntity } from './file-service/file-entity.entity'; 
import { FileModule } from './file-service/file.module';

@Module({
  imports: [
    // Configures GraphQL with Apollo Driver
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver, // Specifies ApolloDriver for GraphQL execution
      autoSchemaFile: true, // Automatically generate the GraphQL schema file based on TypeScript classes
    }),
    // Configures TypeORM with MySQL database
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost', 
      port: 3306, 
      username: 'root',
      password: 'Chathu@2004',
      database: 'test',
      entities: [FileEntity],
      synchronize: true, 
      logging: false,
      driver: require('mysql2'), // Specifies MySQL2 driver for connecting to MySQL
    }),
    FileModule, 
  ],
})
export class AppModule {} 

import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis'; // Correct import

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: 'localhost', // your Redis server host
          port: 6379, // your Redis server port
        });
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}



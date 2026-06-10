import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoClinico } from './domain/entities/video-clinico.entity';
import { VideosClinicoService } from './application/use-cases/videos-clinico.service';
import { VideosClinicoController } from './presentation/controllers/videos-clinico.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VideoClinico])],
  controllers: [VideosClinicoController],
  providers: [VideosClinicoService],
  exports: [VideosClinicoService],
})
export class VideosClinicoModule {}

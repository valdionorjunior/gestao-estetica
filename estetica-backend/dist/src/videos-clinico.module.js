"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosClinicoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const video_clinico_entity_1 = require("./domain/entities/video-clinico.entity");
const videos_clinico_service_1 = require("./application/use-cases/videos-clinico.service");
const videos_clinico_controller_1 = require("./presentation/controllers/videos-clinico.controller");
let VideosClinicoModule = class VideosClinicoModule {
};
exports.VideosClinicoModule = VideosClinicoModule;
exports.VideosClinicoModule = VideosClinicoModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([video_clinico_entity_1.VideoClinico])],
        controllers: [videos_clinico_controller_1.VideosClinicoController],
        providers: [videos_clinico_service_1.VideosClinicoService],
        exports: [videos_clinico_service_1.VideosClinicoService],
    })
], VideosClinicoModule);
//# sourceMappingURL=videos-clinico.module.js.map
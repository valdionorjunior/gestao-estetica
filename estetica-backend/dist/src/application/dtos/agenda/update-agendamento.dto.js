"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAgendamentoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_agendamento_dto_1 = require("./create-agendamento.dto");
class UpdateAgendamentoDto extends (0, swagger_1.PartialType)(create_agendamento_dto_1.CreateAgendamentoDto) {
}
exports.UpdateAgendamentoDto = UpdateAgendamentoDto;
//# sourceMappingURL=update-agendamento.dto.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormaPagamento = exports.ContaStatus = exports.ContaTipo = void 0;
var ContaTipo;
(function (ContaTipo) {
    ContaTipo["RECEITA"] = "RECEITA";
    ContaTipo["DESPESA"] = "DESPESA";
})(ContaTipo || (exports.ContaTipo = ContaTipo = {}));
var ContaStatus;
(function (ContaStatus) {
    ContaStatus["PENDENTE"] = "PENDENTE";
    ContaStatus["PAGO"] = "PAGO";
    ContaStatus["CANCELADO"] = "CANCELADO";
})(ContaStatus || (exports.ContaStatus = ContaStatus = {}));
var FormaPagamento;
(function (FormaPagamento) {
    FormaPagamento["DINHEIRO"] = "DINHEIRO";
    FormaPagamento["CARTAO_DEBITO"] = "CARTAO_DEBITO";
    FormaPagamento["CARTAO_CREDITO"] = "CARTAO_CREDITO";
    FormaPagamento["PIX"] = "PIX";
    FormaPagamento["TRANSFERENCIA"] = "TRANSFERENCIA";
    FormaPagamento["BOLETO"] = "BOLETO";
})(FormaPagamento || (exports.FormaPagamento = FormaPagamento = {}));
//# sourceMappingURL=financeiro.enums.js.map
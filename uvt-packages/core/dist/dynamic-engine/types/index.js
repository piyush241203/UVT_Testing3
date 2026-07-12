"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionMode = exports.PipelinePhase = void 0;
var PipelinePhase;
(function (PipelinePhase) {
    PipelinePhase["BEFORE"] = "BEFORE";
    PipelinePhase["RUN"] = "RUN";
    PipelinePhase["AFTER"] = "AFTER";
    PipelinePhase["CLEANUP"] = "CLEANUP";
})(PipelinePhase || (exports.PipelinePhase = PipelinePhase = {}));
var ExecutionMode;
(function (ExecutionMode) {
    ExecutionMode["SEQUENTIAL"] = "SEQUENTIAL";
    ExecutionMode["PARALLEL"] = "PARALLEL";
})(ExecutionMode || (exports.ExecutionMode = ExecutionMode = {}));
//# sourceMappingURL=index.js.map
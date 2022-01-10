"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var prisma_client_1 = __importDefault(require("../prisma-client"));
var adminRouter = express_1.default.Router();
adminRouter.get('/getApprovalsList', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var pageNum, perPage, results, totalCount;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Getting Approvals List");
                pageNum = req.query.pageNum ? parseInt(req.query.pageNum) : 0;
                perPage = req.query.perPage ? parseInt(req.query.perPage) : 0;
                return [4 /*yield*/, prisma_client_1.default.doctor.findMany({
                        skip: (pageNum - 1) * perPage,
                        take: perPage,
                        where: {
                            verified: false,
                            submittedForVerification: true
                        },
                        orderBy: {
                            submissionTimestamp: "desc"
                        },
                        select: {
                            user: true,
                            uid: true,
                            verified: true,
                            submittedForVerification: true,
                        }
                    })];
            case 1:
                results = _a.sent();
                return [4 /*yield*/, prisma_client_1.default.doctor.count({
                        where: {
                            verified: false,
                            submittedForVerification: true
                        }
                    })];
            case 2:
                totalCount = _a.sent();
                res.json({ totalCount: totalCount, results: results });
                return [2 /*return*/];
        }
    });
}); });
adminRouter.get('/getDoctorDetails', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var doctorUid, foundDoctor;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.query.doctorUid) {
                    res.status(400).send('Doctor Uid not provided');
                }
                doctorUid = req.query.doctorUid;
                return [4 /*yield*/, prisma_client_1.default.doctor.findUnique({
                        where: {
                            uid: doctorUid
                        },
                        include: {
                            user: true
                        }
                    })];
            case 1:
                foundDoctor = _a.sent();
                res.json(foundDoctor);
                return [2 /*return*/];
        }
    });
}); });
adminRouter.post('/approveDoctor', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma_client_1.default.doctor.update({
                    where: {
                        uid: req.body.doctorUid
                    },
                    data: {
                        verified: true
                    }
                })];
            case 1:
                _a.sent();
                res.status(200).send("User " + req.body.doctorUid + " approved as doctor");
                return [2 /*return*/];
        }
    });
}); });
exports.default = adminRouter;
//# sourceMappingURL=admin.js.map
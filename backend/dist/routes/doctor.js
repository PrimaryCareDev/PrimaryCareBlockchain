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
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
var runtime_1 = require("@prisma/client/runtime");
var express_1 = __importDefault(require("express"));
var prisma_client_1 = __importDefault(require("../prisma-client"));
var celebrate_1 = require("celebrate");
var client_1 = require("@prisma/client");
var doctorRouter = express_1.default.Router();
doctorRouter.get('/getPatientRelationships', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, patientList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.currentUser;
                return [4 /*yield*/, prisma_client_1.default.patient.findMany({
                        where: {
                            doctors: {
                                some: {
                                    doctorUid: user.uid
                                }
                            }
                        },
                        select: {
                            user: true,
                            doctors: {
                                where: {
                                    doctorUid: user.uid
                                }
                            }
                        }
                    })];
            case 1:
                patientList = _a.sent();
                res.json(patientList);
                return [2 /*return*/];
        }
    });
}); });
doctorRouter.get('/getPatientRelationship', (0, celebrate_1.celebrate)((_a = {},
    _a[celebrate_1.Segments.QUERY] = {
        patientUid: celebrate_1.Joi.string().required()
    },
    _a)), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, patientUid, currentRelationship;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.currentUser;
                patientUid = req.query.patientUid;
                return [4 /*yield*/, prisma_client_1.default.doctorOnPatient.findUnique({
                        where: {
                            doctorUid_patientUid: {
                                doctorUid: user.uid,
                                patientUid: patientUid
                            }
                        }
                    })];
            case 1:
                currentRelationship = _a.sent();
                res.json(currentRelationship);
                return [2 /*return*/];
        }
    });
}); });
doctorRouter.post('/requestPatient', (0, celebrate_1.celebrate)((_b = {},
    _b[celebrate_1.Segments.BODY] = celebrate_1.Joi.object().keys({
        patientUid: celebrate_1.Joi.string().required()
    }),
    _b)), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, patientUid, roles, validRole, currentRelationship, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.currentUser;
                patientUid = req.body.patientUid;
                return [4 /*yield*/, prisma_client_1.default.userRoles.findMany({
                        where: {
                            uid: patientUid
                        }
                    })];
            case 1:
                roles = _a.sent();
                validRole = roles.filter(function (item) {
                    return item.role === "PATIENT";
                });
                if (validRole.length == 0) {
                    console.log("Provided uid is not a patient: " + patientUid);
                    return [2 /*return*/, res.status(400).send('Something went wrong. Please refresh the page and try again.')];
                }
                return [4 /*yield*/, prisma_client_1.default.doctorOnPatient.findUnique({
                        where: {
                            doctorUid_patientUid: {
                                doctorUid: user.uid,
                                patientUid: patientUid
                            }
                        }
                    })];
            case 2:
                currentRelationship = _a.sent();
                if ((currentRelationship === null || currentRelationship === void 0 ? void 0 : currentRelationship.status) == client_1.RelationshipStatus.ACCEPTED) {
                    return [2 /*return*/, res.status(400).send("You already have access to this patient's data.")];
                }
                return [4 /*yield*/, prisma_client_1.default.doctorOnPatient.upsert({
                        where: {
                            doctorUid_patientUid: {
                                doctorUid: user.uid,
                                patientUid: patientUid
                            }
                        },
                        update: {
                            requester: client_1.Role.DOCTOR,
                            requestedTimestamp: new Date(),
                            status: client_1.RelationshipStatus.REQUESTED
                        },
                        create: {
                            doctorUid: user.uid,
                            patientUid: patientUid,
                            requester: client_1.Role.DOCTOR,
                            status: client_1.RelationshipStatus.REQUESTED
                        }
                    })];
            case 3:
                result = _a.sent();
                res.status(200).send();
                return [2 /*return*/];
        }
    });
}); });
doctorRouter.post('/removePatient', (0, celebrate_1.celebrate)((_c = {},
    _c[celebrate_1.Segments.BODY] = celebrate_1.Joi.object().keys({
        patientUid: celebrate_1.Joi.string().required()
    }),
    _c)), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, patientUid, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.currentUser;
                patientUid = req.body.patientUid;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma_client_1.default.doctorOnPatient.update({
                        where: {
                            doctorUid_patientUid: {
                                doctorUid: user.uid,
                                patientUid: patientUid
                            }
                        },
                        data: {
                            deleter: client_1.Role.DOCTOR,
                            deleteTimestamp: new Date(),
                            status: client_1.RelationshipStatus.DELETED
                        }
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                if (e_1 instanceof runtime_1.PrismaClientKnownRequestError) {
                    console.log("Prisma error code: " + e_1.code);
                    // if (e.code==='P2025') {
                    //     return res.status(400).send("Could not find pre-existing connection with doctor.")
                    // }
                }
                else if (e_1 instanceof Error) {
                    console.log(e_1.message);
                }
                return [2 /*return*/, res.status(500).send("Something went wrong. Please try again.")];
            case 4: return [2 /*return*/, res.status(200).send()];
        }
    });
}); });
doctorRouter.post('/acceptPatient', (0, celebrate_1.celebrate)((_d = {},
    _d[celebrate_1.Segments.BODY] = celebrate_1.Joi.object().keys({
        patientUid: celebrate_1.Joi.string().required()
    }),
    _d)), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, patientUid, record, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.currentUser;
                patientUid = req.body.patientUid;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, prisma_client_1.default.doctorOnPatient.findUnique({
                        where: {
                            doctorUid_patientUid: {
                                doctorUid: user.uid,
                                patientUid: patientUid,
                            }
                        }
                    })];
            case 2:
                record = _a.sent();
                if (record === null || (record.status != client_1.RelationshipStatus.REQUESTED && record.requester != client_1.Role.PATIENT)) {
                    res.status(400).send("Could not find pre-existing invitation from patient");
                }
                return [4 /*yield*/, prisma_client_1.default.doctorOnPatient.update({
                        where: {
                            doctorUid_patientUid: {
                                doctorUid: user.uid,
                                patientUid: patientUid,
                            }
                        },
                        data: {
                            acceptedTimestamp: new Date(),
                            status: client_1.RelationshipStatus.ACCEPTED
                        }
                    })];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                e_2 = _a.sent();
                if (e_2 instanceof runtime_1.PrismaClientKnownRequestError) {
                    console.log("Prisma error code: " + e_2.code);
                    if (e_2.code === 'P2025') {
                        return [2 /*return*/, res.status(400).send("Could not find pre-existing connection with patient.")];
                    }
                }
                else if (e_2 instanceof Error) {
                    console.log(e_2.message);
                }
                return [2 /*return*/, res.status(500).send("Something went wrong. Please try again.")];
            case 5:
                res.status(200).send();
                return [2 /*return*/];
        }
    });
}); });
doctorRouter.post('/rejectPatient', (0, celebrate_1.celebrate)((_e = {},
    _e[celebrate_1.Segments.BODY] = celebrate_1.Joi.object().keys({
        patientUid: celebrate_1.Joi.string().required()
    }),
    _e)), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, patientUid, record, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.currentUser;
                patientUid = req.body.patientUid;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, prisma_client_1.default.doctorOnPatient.findUnique({
                        where: {
                            doctorUid_patientUid: {
                                doctorUid: user.uid,
                                patientUid: patientUid,
                            }
                        }
                    })];
            case 2:
                record = _a.sent();
                if (record === null || (record.status != client_1.RelationshipStatus.REQUESTED && record.requester != client_1.Role.PATIENT)) {
                    res.status(400).send("Could not find pre-existing invitation from patient");
                }
                return [4 /*yield*/, prisma_client_1.default.doctorOnPatient.update({
                        where: {
                            doctorUid_patientUid: {
                                doctorUid: user.uid,
                                patientUid: patientUid,
                            }
                        },
                        data: {
                            rejectedTimestamp: new Date(),
                            status: client_1.RelationshipStatus.REJECTED
                        }
                    })];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                e_3 = _a.sent();
                if (e_3 instanceof runtime_1.PrismaClientKnownRequestError) {
                    console.log("Prisma error code: " + e_3.code);
                    if (e_3.code === 'P2025') {
                        return [2 /*return*/, res.status(400).send("Could not find valid pre-existing connection with patient.")];
                    }
                }
                else if (e_3 instanceof Error) {
                    console.log(e_3.message);
                }
                return [2 /*return*/, res.status(500).send("Something went wrong. Please try again.")];
            case 5:
                res.status(200).send();
                return [2 /*return*/];
        }
    });
}); });
doctorRouter.post('/cancelPatientRequest', (0, celebrate_1.celebrate)((_f = {},
    _f[celebrate_1.Segments.BODY] = celebrate_1.Joi.object().keys({
        patientUid: celebrate_1.Joi.string().required()
    }),
    _f)), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, patientUid, record, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.currentUser;
                patientUid = req.body.patientUid;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, prisma_client_1.default.doctorOnPatient.findUnique({
                        where: {
                            doctorUid_patientUid: {
                                doctorUid: user.uid,
                                patientUid: patientUid,
                            }
                        }
                    })];
            case 2:
                record = _a.sent();
                if (record === null || (record.status != client_1.RelationshipStatus.REQUESTED && record.requester != client_1.Role.DOCTOR)) {
                    res.status(400).send("Could not find valid pre-existing request");
                }
                return [4 /*yield*/, prisma_client_1.default.doctorOnPatient.delete({
                        where: {
                            doctorUid_patientUid: {
                                doctorUid: user.uid,
                                patientUid: patientUid,
                            }
                        }
                    })];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                e_4 = _a.sent();
                if (e_4 instanceof runtime_1.PrismaClientKnownRequestError) {
                    console.log("Prisma error code: " + e_4.code);
                    if (e_4.code === 'P2025') {
                        return [2 /*return*/, res.status(400).send("Could not find pre-existing connection with patient.")];
                    }
                }
                else if (e_4 instanceof Error) {
                    console.log(e_4.message);
                }
                return [2 /*return*/, res.status(500).send("Something went wrong. Please try again.")];
            case 5:
                res.status(200).send();
                return [2 /*return*/];
        }
    });
}); });
doctorRouter.post('/searchPatients', (0, celebrate_1.celebrate)((_g = {},
    _g[celebrate_1.Segments.BODY] = celebrate_1.Joi.object().keys({
        query: celebrate_1.Joi.string().required()
    }),
    _g)), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, query, foundPatient;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.currentUser;
                query = req.body.query;
                return [4 /*yield*/, prisma_client_1.default.patient.findFirst({
                        where: { user: { email: query } },
                        include: {
                            user: true
                        }
                    })];
            case 1:
                foundPatient = _a.sent();
                if (foundPatient === null) {
                    return [2 /*return*/, res.status(400).send("Could not find any patient who uses that email address. Please try a new query.")];
                }
                res.json(foundPatient);
                return [2 /*return*/];
        }
    });
}); });
doctorRouter.get('/getPatients', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, patientList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.currentUser;
                return [4 /*yield*/, prisma_client_1.default.patient.findMany({
                        where: {
                            doctors: {
                                some: {
                                    doctorUid: user.uid,
                                    status: client_1.RelationshipStatus.ACCEPTED
                                }
                            }
                        },
                        select: {
                            user: true,
                            doctors: {
                                where: {
                                    doctorUid: user.uid
                                }
                            }
                        }
                    })];
            case 1:
                patientList = _a.sent();
                res.json(patientList);
                return [2 /*return*/];
        }
    });
}); });
exports.default = doctorRouter;
//# sourceMappingURL=doctor.js.map
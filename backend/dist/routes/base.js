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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var runtime_1 = require("@prisma/client/runtime");
var express_1 = __importDefault(require("express"));
var prisma_client_1 = __importDefault(require("../prisma-client"));
var celebrate_1 = require("celebrate");
var baseRouter = express_1.default.Router();
baseRouter.get('/verifyIdToken', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        console.log("Returning Verification");
        user = req.currentUser;
        res.json(req.currentUser);
        return [2 /*return*/];
    });
}); });
baseRouter.post('/registerDoctor', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.currentUser;
                console.log("Trying to create Doctor record for " + user.email);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma_client_1.default.$transaction([
                        prisma_client_1.default.user.create({
                            data: {
                                uid: user.uid,
                                email: user.email
                            }
                        }),
                        prisma_client_1.default.doctor.create({
                            data: {
                                uid: user.uid
                            }
                        }),
                        prisma_client_1.default.userRoles.create({
                            data: {
                                uid: user.uid,
                                role: 'DOCTOR'
                            }
                        })
                    ])];
            case 2:
                _a.sent();
                res.status(200).send('Doctor record created for ' + user.email);
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                console.log("Error creating doctor record");
                if (e_1 instanceof Error) {
                    console.log(e_1.message);
                }
                res.status(500).send();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
baseRouter.post('/registerPatient', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.currentUser;
                console.log("Trying to create Patient record for " + user.email);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma_client_1.default.$transaction([
                        prisma_client_1.default.user.create({
                            data: {
                                uid: user.uid,
                                email: user.email
                            }
                        }),
                        prisma_client_1.default.patient.create({
                            data: {
                                uid: user.uid
                            }
                        }),
                        prisma_client_1.default.userRoles.create({
                            data: {
                                uid: user.uid,
                                role: 'PATIENT'
                            }
                        })
                    ])];
            case 2:
                _a.sent();
                res.status(200).send('Patient record created for' + user.email);
                return [3 /*break*/, 4];
            case 3:
                e_2 = _a.sent();
                console.log("Error creating doctor record");
                if (e_2 instanceof Error) {
                    console.log(e_2.message);
                }
                res.status(500).send();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
baseRouter.get('/getUserDetails', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, foundUser, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.currentUser;
                console.log("Getting user details for " + user.email);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma_client_1.default.user.findUnique({
                        where: {
                            uid: user.uid
                        },
                        include: {
                            doctor: true,
                            patient: {
                                include: {
                                    doctors: true
                                }
                            },
                            userRoles: true
                        }
                    })];
            case 2:
                foundUser = _a.sent();
                res.json(foundUser);
                return [3 /*break*/, 4];
            case 3:
                e_3 = _a.sent();
                if (e_3 instanceof runtime_1.PrismaClientKnownRequestError) {
                    console.log("Prisma error code: " + e_3.code);
                }
                else if (e_3 instanceof Error) {
                    console.log(e_3.message);
                }
                return [2 /*return*/, res.status(400).send("User not found.")];
            case 4: return [2 /*return*/];
        }
    });
}); });
baseRouter.post('/doctorVerificationSubmission', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.currentUser;
                console.log("Storing doctor verification details for " + user.email);
                return [4 /*yield*/, prisma_client_1.default.$transaction([
                        prisma_client_1.default.user.update({
                            where: {
                                uid: user.uid
                            },
                            data: {
                                firstName: req.body.firstName,
                                lastName: req.body.lastName,
                                avatarImageUrl: req.body.avatarImageUrl
                            }
                        }),
                        prisma_client_1.default.doctor.update({
                            where: {
                                uid: user.uid
                            },
                            data: {
                                idImageUrl: req.body.idImageUrl,
                                medicalPractice: req.body.medicalPractice,
                                medicalLicenseNumber: req.body.medicalLicenseNumber,
                                licenseImageUrl: req.body.licenseImageUrl,
                                submittedForVerification: true,
                                submissionTimestamp: new Date()
                            }
                        })
                    ])];
            case 1:
                _a.sent();
                res.status(200).send('Doctor verification submitted for ' + user.email);
                return [2 /*return*/];
        }
    });
}); });
baseRouter.post('/updateAvatarImage', (0, celebrate_1.celebrate)((_a = {},
    _a[celebrate_1.Segments.BODY] = celebrate_1.Joi.object().keys({
        avatarImageUrl: celebrate_1.Joi.string().required()
    }),
    _a)), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, avatarImageUrl;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.currentUser;
                avatarImageUrl = req.body.avatarImageUrl;
                return [4 /*yield*/, prisma_client_1.default.user.update({
                        where: {
                            uid: user.uid
                        },
                        data: {
                            avatarImageUrl: avatarImageUrl
                        }
                    })];
            case 1:
                _a.sent();
                res.status(200).send();
                return [2 /*return*/];
        }
    });
}); });
baseRouter.post('/updateName', (0, celebrate_1.celebrate)((_b = {},
    _b[celebrate_1.Segments.BODY] = celebrate_1.Joi.object().keys({
        firstName: celebrate_1.Joi.string().required(),
        lastName: celebrate_1.Joi.string().required()
    }),
    _b)), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, firstName, lastName;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = req.currentUser;
                _a = req.body, firstName = _a.firstName, lastName = _a.lastName;
                return [4 /*yield*/, prisma_client_1.default.user.update({
                        where: {
                            uid: user.uid
                        },
                        data: {
                            firstName: firstName,
                            lastName: lastName
                        }
                    })];
            case 1:
                _b.sent();
                res.status(200).send();
                return [2 /*return*/];
        }
    });
}); });
exports.default = baseRouter;
//# sourceMappingURL=base.js.map
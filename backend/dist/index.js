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
var dotenv_1 = __importDefault(require("dotenv"));
var app_1 = require("firebase-admin/app");
var auth_1 = require("firebase-admin/auth");
var client_1 = require("@prisma/client");
var runtime_1 = require("@prisma/client/runtime");
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
var prisma = new client_1.PrismaClient();
var app = (0, express_1.default)();
var serviceAccount = JSON.parse(process.env.FIREBASE_CREDS);
var firebaseApp = (0, app_1.initializeApp)({
    credential: (0, app_1.cert)(serviceAccount)
});
// Decodes the Firebase JSON Web Token
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(decodeIDToken);
app.use('/admin', verifyAdminRole);
/**
 * Decodes the JSON Web Token sent via the frontend app
 * Makes the currentUser (firebase) data available on the body.
 */
function decodeIDToken(req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var idToken, _c, err_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!((_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.startsWith('Bearer '))) return [3 /*break*/, 4];
                    idToken = req.headers.authorization.split('Bearer ')[1];
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    _c = req;
                    return [4 /*yield*/, (0, auth_1.getAuth)().verifyIdToken(idToken)];
                case 2:
                    _c.currentUser = _d.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _d.sent();
                    console.log(err_1);
                    return [3 /*break*/, 4];
                case 4:
                    console.log(req.currentUser);
                    if (!req.currentUser) {
                        return [2 /*return*/, res.status(403).send("You must be logged in")];
                    }
                    next();
                    return [2 /*return*/];
            }
        });
    });
}
function verifyAdminRole(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var user, roles, validRole;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Verifying admin role");
                    user = req.currentUser;
                    return [4 /*yield*/, prisma.userRoles.findMany({
                            where: {
                                uid: user.uid
                            }
                        })];
                case 1:
                    roles = _a.sent();
                    validRole = roles.filter(function (item) {
                        return item.role === "ADMIN";
                    });
                    if (validRole.length == 0) {
                        console.log("Invalid Role: Only admins can access list of all doctors awaiting approval");
                        return [2 /*return*/, res.status(403).send('User does not have a valid role')];
                    }
                    next();
                    return [2 /*return*/];
            }
        });
    });
}
app.get('/test', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.user.findMany()];
            case 1:
                users = _a.sent();
                res.json(users);
                return [2 /*return*/];
        }
    });
}); });
//for debugging
app.get('/verifyIdToken', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        console.log("Returning Verification");
        user = req.currentUser;
        res.json(req.currentUser);
        return [2 /*return*/];
    });
}); });
app.post('/registerDoctor', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.currentUser;
                console.log("Trying to create Doctor record for " + user.email);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma.$transaction([
                        prisma.user.create({
                            data: {
                                uid: user.uid,
                                email: user.email
                            }
                        }),
                        prisma.doctor.create({
                            data: {
                                uid: user.uid
                            }
                        }),
                        prisma.userRoles.create({
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
app.post('/registerPatient', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.currentUser;
                console.log("Trying to create Patient record for " + user.email);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma.$transaction([
                        prisma.user.create({
                            data: {
                                uid: user.uid,
                                email: user.email
                            }
                        }),
                        prisma.patient.create({
                            data: {
                                uid: user.uid
                            }
                        }),
                        prisma.userRoles.create({
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
app.get('/getUserDetails', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, assertedrole, roles, validRole, foundUser, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.currentUser;
                assertedrole = req.headers.assertedrole;
                console.log("Getting user details for " + user.email);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, prisma.userRoles.findMany({
                        where: {
                            uid: user.uid
                        }
                    })];
            case 2:
                roles = _a.sent();
                validRole = roles.filter(function (item) {
                    return item.role === assertedrole;
                });
                if (validRole.length == 0) {
                    console.log("Invalid Role");
                    res.status(403).send('User does not have a valid role');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, prisma.user.findUnique({
                        where: {
                            uid: user.uid
                        },
                        include: {
                            doctor: assertedrole === "DOCTOR",
                            patient: assertedrole === "PATIENT",
                            userRoles: true
                        }
                    })];
            case 3:
                foundUser = _a.sent();
                res.json(foundUser);
                return [3 /*break*/, 5];
            case 4:
                e_3 = _a.sent();
                if (e_3 instanceof runtime_1.PrismaClientKnownRequestError) {
                    console.log("Prisma error code: " + e_3.code);
                }
                else if (e_3 instanceof Error) {
                    console.log(e_3.message);
                }
                throw e_3;
            case 5: return [2 /*return*/];
        }
    });
}); });
app.post('/doctorVerificationSubmission', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.currentUser;
                console.log("Storing doctor verification details for " + user.email);
                return [4 /*yield*/, prisma.$transaction([
                        prisma.user.update({
                            where: {
                                uid: user.uid
                            },
                            data: {
                                firstName: req.body.firstName,
                                lastName: req.body.lastName,
                                avatarImageUrl: req.body.avatarImageUrl
                            }
                        }),
                        prisma.doctor.update({
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
app.get('/admin/getApprovalsList', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var pageNum, perPage, results, totalCount;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Getting Approvals List");
                pageNum = req.query.pageNum ? parseInt(req.query.pageNum) : 0;
                perPage = req.query.perPage ? parseInt(req.query.perPage) : 0;
                return [4 /*yield*/, prisma.doctor.findMany({
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
                return [4 /*yield*/, prisma.doctor.count({
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
app.get('/admin/getDoctorDetails', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var doctorUid, foundDoctor;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.query.doctorUid) {
                    res.status(400).send('Doctor Uid not provided');
                }
                doctorUid = req.query.doctorUid;
                return [4 /*yield*/, prisma.doctor.findUnique({
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
app.post('/admin/approveDoctor', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.doctor.update({
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
app.get('/patient/getDoctors', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var pageNum;
    return __generator(this, function (_a) {
        pageNum = req.query.pageNum ? parseInt(req.query.pageNum) : 0;
        return [2 /*return*/];
    });
}); });
// start the server listening for requests
app.listen(process.env.PORT || 5000, function () { return console.log("Server is running..."); });
//# sourceMappingURL=index.js.map
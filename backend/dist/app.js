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
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var celebrate_1 = require("celebrate");
var prisma_client_1 = __importDefault(require("./prisma-client"));
var base_1 = __importDefault(require("./routes/base"));
var admin_1 = __importDefault(require("./routes/admin"));
var patient_1 = __importDefault(require("./routes/patient"));
var doctor_1 = __importDefault(require("./routes/doctor"));
var client_1 = require("@prisma/client");
dotenv_1.default.config();
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
app.use('/patient', verifyPatientRole);
app.use('/doctor', verifyDoctorRole);
app.use('/', base_1.default);
app.use('/admin', admin_1.default);
app.use('/patient', patient_1.default);
app.use('/doctor', doctor_1.default);
app.use((0, celebrate_1.errors)());
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
                    user = req.currentUser;
                    return [4 /*yield*/, prisma_client_1.default.userRoles.findMany({
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
function verifyPatientRole(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var user, roles, validRole;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = req.currentUser;
                    return [4 /*yield*/, prisma_client_1.default.userRoles.findMany({
                            where: {
                                uid: user.uid
                            }
                        })];
                case 1:
                    roles = _a.sent();
                    validRole = roles.filter(function (item) {
                        return item.role === client_1.Role.PATIENT;
                    });
                    if (validRole.length == 0) {
                        console.log("Invalid Role: Only patients can access this API. email: " + user.email);
                        return [2 /*return*/, res.status(403).send('User does not have a valid role')];
                    }
                    next();
                    return [2 /*return*/];
            }
        });
    });
}
function verifyDoctorRole(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var user, roles, validRole;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = req.currentUser;
                    return [4 /*yield*/, prisma_client_1.default.userRoles.findMany({
                            where: {
                                uid: user.uid
                            }
                        })];
                case 1:
                    roles = _a.sent();
                    validRole = roles.filter(function (item) {
                        return item.role === client_1.Role.DOCTOR;
                    });
                    if (validRole.length == 0) {
                        console.log("Invalid Role: Only doctors can access this API. email: " + user.email);
                        return [2 /*return*/, res.status(403).send('User does not have a valid role')];
                    }
                    next();
                    return [2 /*return*/];
            }
        });
    });
}
// start the server listening for requests
app.listen(process.env.PORT || 5000, function () { return console.log("Server is running..."); });
//# sourceMappingURL=app.js.map
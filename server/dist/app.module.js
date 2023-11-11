"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const payment_controller_1 = require("./payment/payment.controller");
const payment_service_1 = require("./payment/payment.service");
const profile_module_1 = require("./profile/profile.module");
const ride_module_1 = require("./ride/ride.module");
const user_module_1 = require("./user/user.module");
const vehicles_module_1 = require("./vehicles/vehicles.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
                isGlobal: true
            }),
            mongoose_1.MongooseModule.forRoot(process.env.DB_URI),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            ride_module_1.RideModule,
            vehicles_module_1.VehiclesModule,
            profile_module_1.ProfileModule
        ],
        controllers: [app_controller_1.AppController, payment_controller_1.PaymentController],
        providers: [app_service_1.AppService, payment_service_1.PaymentService]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
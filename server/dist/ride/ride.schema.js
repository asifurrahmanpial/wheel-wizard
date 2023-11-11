"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideSchema = exports.Ride = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Ride = class Ride extends mongoose_2.Document {
};
exports.Ride = Ride;
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            type: String,
            required: true,
            default: 'Feature'
        },
        properties: {
            type: Object,
            default: {}
        },
        geometry: {
            type: {
                type: String,
                required: true,
                default: 'LineString'
            },
            coordinates: {
                type: [[[Number]]],
                required: true,
                default: []
            }
        }
    }),
    __metadata("design:type", Object)
], Ride.prototype, "geojson", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        required: true
    }),
    __metadata("design:type", Number)
], Ride.prototype, "fare", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        required: true
    }),
    __metadata("design:type", Number)
], Ride.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
        required: true
    }),
    __metadata("design:type", Date)
], Ride.prototype, "startTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
        required: true
    }),
    __metadata("design:type", Date)
], Ride.prototype, "endTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        required: true
    }),
    __metadata("design:type", Number)
], Ride.prototype, "distance", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.default.Types.ObjectId)
], Ride.prototype, "bookedBy", void 0);
exports.Ride = Ride = __decorate([
    (0, mongoose_1.Schema)()
], Ride);
exports.RideSchema = mongoose_1.SchemaFactory.createForClass(Ride);
//# sourceMappingURL=ride.schema.js.map
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ProfileService = class ProfileService {
    constructor(profileModel) {
        this.profileModel = profileModel;
    }
    async createProfile(userId, username, userEmail) {
        const newProfile = new this.profileModel({
            totalTrips: 0,
            totalFare: 0,
            totalDuration: 0,
            totalDistance: 0,
            username,
            userEmail,
            userId
        });
        return newProfile.save();
    }
    async updateProfile(id, updateProfileDto) {
        return this.profileModel
            .findByIdAndUpdate(id, updateProfileDto, { new: true })
            .exec();
    }
    async findByUserId(userId) {
        return this.profileModel.findOne({ userId }).exec();
    }
    async getProfile(id) {
        return this.profileModel.findById(id).exec();
    }
    async getProfileByUserId(userId) {
        return this.profileModel.findOne({ userId: userId }).exec();
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Profile')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProfileService);
//# sourceMappingURL=profile.service.js.map
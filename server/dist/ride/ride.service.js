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
exports.RideService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const profile_service_1 = require("../profile/profile.service");
let RideService = class RideService {
    constructor(rideModel, profileService) {
        this.rideModel = rideModel;
        this.profileService = profileService;
    }
    sanitizeNumber(input) {
        if (typeof input === 'number') {
            return input;
        }
        return Number(input.replace('.', '').replace(',', '.'));
    }
    async createRide(rideData) {
        const createdRide = new this.rideModel(rideData);
        if (rideData.bookedBy) {
            const profile = await this.profileService.getProfileByUserId(rideData.bookedBy.toString());
            if (!profile) {
                throw new Error('No profile found for the provided user ID');
            }
            createdRide.bookedBy = profile._id;
            const updatedProfile = {
                totalTrips: profile.totalTrips + 1,
                totalFare: profile.totalFare + rideData.fare,
                totalDuration: profile.totalDuration + rideData.duration,
                totalDistance: profile.totalDistance + this.sanitizeNumber(rideData.distance)
            };
            await this.profileService.updateProfile(profile._id.toString(), updatedProfile);
        }
        else {
            throw new Error('bookedBy field is undefined');
        }
        return createdRide.save();
    }
    async findAllRides() {
        return this.rideModel.find().exec();
    }
    async findRidesByUser(userId) {
        const profile = await this.profileService.getProfileByUserId(userId);
        if (!profile) {
            throw new Error('No profile found for the provided user ID');
        }
        return this.rideModel.find({ bookedBy: profile._id.toString() }).exec();
    }
};
exports.RideService = RideService;
exports.RideService = RideService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Ride')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        profile_service_1.ProfileService])
], RideService);
//# sourceMappingURL=ride.service.js.map
import bcryptjs from "bcryptjs"
// import mongoose from "mongoose";
import { UserModel } from "../models/user";
import { OTPModel } from "../models/otpStore";
import lodash from "lodash";
import { BaseService } from "../utils/ServiceHandler";
import CustomError  from "../utils/error";
import { ResponseBodyWrapper } from "../utils/ResponseWrapper";
import jsonWebToken from 'jsonwebtoken';
import { ObjectId } from "mongoose";
// import emailService = require('./../utils/emailService')
import { sendPlainMail } from "../utils/emailService";
import {forgotPasswordEmailTemplate} from './../utils/templates/forgotPasswordEmail';
import {otpTemplate} from './../utils/templates/otpTemplate';


class Auth {
    private userModel: any;
    private otpModel: any;
    customError: any;
    constructor() {
        this.customError = new CustomError()
        this.userModel = UserModel;
        this.otpModel = OTPModel;
    }

    private async encrypt(password: string) {
        let salt = await bcryptjs.genSalt(16);
        let hashedPassword = await bcryptjs.hash(password, salt);
        return hashedPassword;
    }

    private async compare(check: string, from: string) {
        return await bcryptjs.compare(check, from);
    }

    private async createAccessToken(user: any) {
        let secret: any = process.env.SECRET
        let token = jsonWebToken.sign({email: user.email, first_name: user.first_name, last_name: user.last_name}, secret);
        return token;
    }

    private createResetLink(userId: string) {
        let utcTime = new Date().getTime();
        return `${process.env.FRONTENDURL}${btoa(`${userId}-${utcTime}`)}`
    }

    async sendOTP(userId: string, email: string, name: string) {
        const uniqueOTP = Math.floor(100000 + Math.random() * 900000)
        const timestamp = new Date().getTime()
        await this.otpModel.findOneAndUpdate({userId: userId},{userId: userId, otp: `${uniqueOTP}`, timestamp: timestamp}, {upsert: true});
        sendPlainMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'OTP',
            text: '',
            html: otpTemplate(name, `${uniqueOTP}`),
        })
    }


    async validateOTP(userId: ObjectId, userOTP: string) {
        const otpInformation = this.otpModel.findOne({userId: userId});
        const currentTimestamp = new Date().getTime();
        if(currentTimestamp - (parseInt(otpInformation)+900000)<0) {
            return this.customError.badRequest('OTP expired')
        }

        if(otpInformation.otp != userOTP) {
            return this.customError.badRequest('Incorret OTP')
        }

        let userProfile = await this.userModel.findOne({_id: userId});
        const token: string = await this.createAccessToken(userProfile);
        return ResponseBodyWrapper(200, 'Login Successful', {token})
    }

    async login(userCerdentials: any) {
        let userProfile = await this.userModel.findOne({"email": userCerdentials.email});
        if(lodash.isEmpty(userProfile)) {
            return this.customError.unAuthorized();
        }
        let correctUser: boolean = await this.compare(userCerdentials.password, userProfile.password);
        if(!correctUser) {
            return this.customError.unAuthorized();
        }
        return ResponseBodyWrapper(200, 'Password Validated')
    }

    async register(userInformation: any) {
        let {first_name, last_name, email, password, user_name, verified = false} = userInformation
        let user: any = await this.userModel.findOne({"email": userInformation.email});
        if(!lodash.isEmpty(user)) {
            return this.customError.duplicateError()
        }
        user = await this.userModel.findOne({'user_name': user_name});
        if(!lodash.isEmpty(user)) {
            return this.customError.badRequest("User Name Already In Use, Pls try a different User Name");
        }
        let encPass: string = await this.encrypt(password);
        await this.userModel.create({first_name, last_name, email, password:encPass, user_name, verified});
        return ResponseBodyWrapper(200, 'User Registration Successful')
    }


    async forgotPassword(id: ObjectId) {
        const user =  await this.userModel.find({_id: "id"});
        if(!user.length) {
            return this.customError.badRequest('No User with Found')
        }
        sendPlainMail({
            from: process.env.EMAIL,
            to: user[0].email,
            subject: 'RESET PASSWORD',
            text: '',
            html: forgotPasswordEmailTemplate(user[0].name, this.createResetLink(user[0]._id)),
        })
        return ResponseBodyWrapper(200, 'Reset Email sent Successfully')
    
    }


    async changePassword(userInformation: any) {
        if(lodash.isEmpty(userInformation)) {
            return this.customError.badRequest('No Body');
        }

        let decodedData = atob(userInformation.hashedData);
        let [userId, time] = decodedData.split('-');
        let currentUtcTime = new Date().getTime();

        if(currentUtcTime-parseInt(time)+1800000 <0) {
            return this.customError.badRequest('Link Expired')
        }
        let password = await this.encrypt(userInformation.newPassword)

        await this.userModel.findByIdAndUpdate({_id: userId}, {password: password}, {new: false, runValidators: true  })

        return ResponseBodyWrapper(200, 'Password Updated SuccessFully')
    }
}

export default Auth


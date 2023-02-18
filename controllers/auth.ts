import bcryptjs from "bcryptjs"
// import mongoose from "mongoose";
import { UserModel } from "../models/user";
import lodash from "lodash";
import { BaseService } from "../utils/ServiceHandler";
import CustomError  from "../utils/error";
import { ResponseBodyWrapper } from "../utils/ResponseWrapper";
import jsonWebToken from 'jsonwebtoken';

class Auth {
    private userModel: any;
    customError: any;
    constructor() {
        this.customError = new CustomError()
        this.userModel = UserModel;
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
        const token: string = await this.createAccessToken(userProfile);
        return ResponseBodyWrapper(200, 'Login Successful', {token})
    }

    async register(userInformation: any) {
        // 1. check if user with same email exists in DB
        let {first_name, last_name, email, password, user_name, verified = false} = userInformation
        let user: any = await this.userModel.findOne({"email": userInformation.email});
        if(!lodash.isEmpty(user)) {
            return this.customError.duplicateError()
        }
        user = await this.userModel.findOne({'user_name': user_name});
        if(!lodash.isEmpty(user)) {
            return this.customError.badRequest("User Name Already In Use, Pls try a different User Name");
        }
        // 2. encrypt the user password
        let encPass: string = await this.encrypt(password);
        // 3. store the user info with the encrypted password in DB with email as not verified;
        await this.userModel.create({first_name, last_name, email, password:encPass, user_name, verified});
        return ResponseBodyWrapper(200, 'User Registratino Successful')
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
}

export default Auth


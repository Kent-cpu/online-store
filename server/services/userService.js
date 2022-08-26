const ApiError = require("../error/ApiError");
const userModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const mailService = require("./mailService");
const tokenService = require("./tokenService");
const UserDto = require("../dtos/user-dto");



class UserService {
    async registration(email, password, nickname) {
        const candidate = await userModel.findOne({ email });
        if (candidate) {
            throw ApiError.badRequest(`Пользователь с почтовым адресом ${email} уже существует`);
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4(); // v34fa-asfasf-142saf-sa-asf

        const user = await userModel.create({ email, nickname, password: hashPassword, activationLink });
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDto(user); // id, email, isActivated
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveRefreshToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    }

    async login(email, password) {
        const user = await userModel.findOne({ email: email });
        if (!user) {
            throw ApiError.badRequest(`Пользователь не найден`);
        }
        let comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            return ApiError.badRequest("Неверный пароль");
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveRefreshToken(userDto.id, tokens.refreshToken);
        return { user: userDto, ...tokens };

    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.unauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData && !tokenFromDb) {
            throw ApiError.unauthorizedError();
        }
        const user = await userModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveRefreshToken(userDto.id, tokens.refreshToken);
        return { user: userDto, ...tokens };
    }

    async activate(activationLink) {
        const user = await userModel.findOne({ activationLink });
        if (!user) {
            throw ApiError.badRequest(`Неккоректная ссылка активации`);
        }
        user.isActivated = true;
        await user.save();
    }

    async check({ id }) {

    }
}

module.exports = new UserService();
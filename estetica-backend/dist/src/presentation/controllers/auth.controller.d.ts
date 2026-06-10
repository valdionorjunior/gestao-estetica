import { AuthService } from '../../application/use-cases/auth.service';
import { RegisterDto } from '../../application/dtos/auth/register.dto';
import { LoginDto } from '../../application/dtos/auth/login.dto';
import { RefreshTokenDto } from '../../application/dtos/auth/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private readonly authService;
    private readonly jwtService;
    private readonly config;
    constructor(authService: AuthService, jwtService: JwtService, config: ConfigService);
    register(dto: RegisterDto): Promise<import("../../application/dtos/auth/auth-response.dto").AuthResponseDto>;
    login(dto: LoginDto): Promise<import("../../application/dtos/auth/auth-response.dto").AuthResponseDto>;
    refresh(dto: RefreshTokenDto): Promise<import("../../application/dtos/auth/auth-response.dto").AuthResponseDto>;
    logout(user: {
        id: string;
    }): Promise<void>;
}

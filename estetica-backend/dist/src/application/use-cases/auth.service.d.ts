import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { RegisterDto } from '../dtos/auth/register.dto';
import { LoginDto } from '../dtos/auth/login.dto';
import { AuthResponseDto } from '../dtos/auth/auth-response.dto';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    private readonly config;
    constructor(userRepository: UserRepository, jwtService: JwtService, config: ConfigService);
    register(dto: RegisterDto): Promise<AuthResponseDto>;
    login(dto: LoginDto): Promise<AuthResponseDto>;
    refresh(userId: string, rawToken: string): Promise<AuthResponseDto>;
    logout(userId: string): Promise<void>;
    private buildTokens;
}

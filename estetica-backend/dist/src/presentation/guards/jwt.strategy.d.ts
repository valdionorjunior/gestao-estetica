import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    clinicaId: string | null;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly userRepository;
    constructor(config: ConfigService, userRepository: UserRepository);
    validate(payload: JwtPayload): Promise<{
        id: string;
        email: string;
        role: import("../../domain/entities/user-role.enum").UserRole;
        clinicaId: string | null;
    }>;
}
export {};

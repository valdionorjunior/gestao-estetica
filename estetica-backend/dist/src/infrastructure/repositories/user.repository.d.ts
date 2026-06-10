import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
export declare class UserRepository {
    private readonly repo;
    constructor(repo: Repository<User>);
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(data: Partial<User>): Promise<User>;
    updateRefreshToken(id: string, hash: string | null): Promise<void>;
    updateUltimoLogin(id: string): Promise<void>;
}

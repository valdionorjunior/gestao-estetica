import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from '../../application/use-cases/auth.service';
import { RegisterDto } from '../../application/dtos/auth/register.dto';
import { LoginDto } from '../../application/dtos/auth/login.dto';
import { RefreshTokenDto } from '../../application/dtos/auth/refresh-token.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou senha fraca' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Login com e-mail e senha' })
  @ApiResponse({ status: 200, description: 'Login efetuado — retorna accessToken e refreshToken' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Credenciais incorretas' })
  @ApiResponse({ status: 429, description: 'Muitas tentativas de login (rate limit)' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renovar access token via refresh token' })
  @ApiResponse({ status: 200, description: 'Novo accessToken gerado' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido ou expirado' })
  async refresh(@Body() dto: RefreshTokenDto) {
    const payload = this.jwtService.verify(dto.refreshToken, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
    });
    return this.authService.refresh(payload.sub as string, dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Logout — invalida refresh token' })
  @ApiResponse({ status: 204, description: 'Logout realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async logout(@CurrentUser() user: { id: string }) {
    await this.authService.logout(user.id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../../domain/entities/user-role.enum';
import { UsuariosService } from '../../application/use-cases/usuarios.service';
import {
  CreateUsuarioDto,
  UpdateUsuarioDto,
  UsuarioResponseDto,
} from '../../application/dtos/usuarios/usuario.dto';

@ApiTags('Usuários')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly service: UsuariosService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar todos os usuários (ADMIN only)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'busca', required: false, type: String, description: 'Busca por nome ou e-mail' })
  @ApiResponse({ status: 200, description: 'Lista paginada de usuários' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado — apenas ADMIN' })
  listar(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
    @Query('busca') busca?: string,
  ) {
    return this.service.listar({ page, limit, busca });
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Buscar usuário por ID (ADMIN only)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: UsuarioResponseDto })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  buscarPorId(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.buscarPorId(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Criar usuário com qualquer role (ADMIN only)' })
  @ApiResponse({ status: 201, type: UsuarioResponseDto, description: 'Usuário criado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado' })
  criar(@Body() dto: CreateUsuarioDto) {
    return this.service.criar(dto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Editar nome, role ou status do usuário (ADMIN only)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: UsuarioResponseDto })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  atualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUsuarioDto,
  ) {
    return this.service.atualizar(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Desativar conta de usuário — soft delete (ADMIN only)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Conta desativada' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  desativar(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.desativar(id);
  }
}

import { rslog } from 'src/utils/rslog';
import { AdminEntity } from './entities/admin.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
  ) {}
  async create(createAdminDto: CreateAdminDto) {
    const existAdmin = await this.findByUsername(createAdminDto.username);
    if (existAdmin) {
      throw new HttpException('管理员名字已存在！', HttpStatus.BAD_REQUEST);
    }

    const newUser = await this.adminRepository.create(createAdminDto);
    return this.adminRepository.save(newUser);
  }

  findByUsername(username: string) {
    return this.adminRepository.findOne({ where: { username } });
  }

  async findByAdminId(admin_id: number) {
    const existAdmin = await this.adminRepository.findOne({
      where: { admin_id },
      select: ['admin_id', 'username', 'createTime'],
    });
    const newObj = {
      userId: '2',
      nickname: '系统管理员',
      avatar: 'https://s2.loli.net/2022/04/07/gw1L2Z5sPtS8GIl.gif',
      roles: ['ADMIN'],
      perms: ['sys:user:edit', 'sys:user:delete', 'sys:user:add'],
    };
    return newObj;
  }

  async adminLogin(createAdminDto: CreateAdminDto) {
    const { username, password } = createAdminDto;
    const existAdmin = await this.findByUsername(username);
    rslog.log('existAdmin', existAdmin);
    if (!existAdmin) {
      throw new HttpException('账号或密码错误1！', HttpStatus.BAD_REQUEST);
    }

    const isPass = AdminEntity.comparePassword(password, existAdmin.password);
    if (!isPass) {
      throw new HttpException('账号或密码错误2！', HttpStatus.BAD_REQUEST);
    }
    return existAdmin;
  }
}

import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: '用户名或密码不能为空！' })
  username: string;

  @IsNotEmpty({ message: '用户名或密码不能为空！' })
  password: string;

  @IsNotEmpty({ message: '邮箱不能为空！' })
  @IsEmail({ message: '邮箱格式不正确！' })
  email: string;

  @IsNotEmpty({ message: '头像链接不能为空！' })
  avatar: string;
}

export class LoginDto {
  @IsNotEmpty({ message: '用户名或密码不能为空！' })
  username: string;

  @IsNotEmpty({ message: '用户名或密码不能为空！' })
  password: string;
}

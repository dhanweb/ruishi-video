import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/transform.Interceptor';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { HttpExceptionFilter } from './filters/http-execption.filter';
import configuration from '../config/index';
import { rslog } from './utils/rslog';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix('/api');
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new AllExceptionFilter());
  const config = configuration();
  const port = config.app.port;
  await app.listen(port);

  app.enableCors();

  rslog.trace('服务启动成功，启动端口为：' + port);
}
bootstrap();

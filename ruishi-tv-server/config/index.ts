import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import type { StorageClass } from 'cos-nodejs-sdk-v5';

const configFileNameObj = {
  development: 'dev',
  test: 'test',
  production: 'prod',
};

type CONFIG = {
  app: {
    prefix: string;
    port: string;
  };
  file: {
    location: string;
    serveRoot: string;
    SecretId: string;
    SecretKey: string;
    Key: string;
    Time: number;
    Bucket: string;
    Region: string;
    StorageClass: StorageClass;
  };
  redis: {
    host: string;
    port: number;
    name: string;
  };
  jwt: {
    secretkey: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
  user: {
    SECRET_KEY: string;
  };
};

const env = process.env.NODE_ENV;

export default (): CONFIG => {
  return yaml.load(
    // readFileSync(join(__dirname, `${env ? 'dev' : 'prod'}.yaml`), 'utf8'),
    readFileSync(join(__dirname, `dev.yaml`), 'utf8'),
  ) as CONFIG;
};

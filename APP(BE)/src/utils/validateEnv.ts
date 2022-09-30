import { cleanEnv, port, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    HTTP_PORT: port(),
    HTTPS_PORT: port(),
  });
};

export default validateEnv;

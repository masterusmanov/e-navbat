import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';


const start = async () => {
  try{
    const PORT = process.env.PORT || 1987;
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser())
    app.setGlobalPrefix('api')
    await app.listen(PORT, () =>{
      console.log(`${PORT}th port server is running`);
    });
  }catch(error){
    console.log(error);
  }
}
start()
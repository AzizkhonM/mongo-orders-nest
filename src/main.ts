import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'
import * as cookieParser from "cookie-parser"

const start = async () => {
  try {
    const PORT = process.env.PORT
    const app = await NestFactory.create(AppModule);
    let date = new Date()
    console.log(date);
    
    app.setGlobalPrefix("api")
    app.use(cookieParser())
    await app.listen(PORT, () => {
      console.log(`Server ${PORT}-portda`);
      console.log(date);
      
    })
  } catch (error) {
    console.log(error);
    
  }
}

start();
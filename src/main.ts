import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'

const start = async () => {
  try {
    const PORT = process.env.PORT
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix("api")
    await app.listen(PORT, () => {
      console.log(`Server ${PORT}-portda`);
      
    })
  } catch (error) {
    console.log(error);
    
  }
}

start();
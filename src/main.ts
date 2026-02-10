import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: ["POST", "GET", "DELETE"],
    credentials: true
  });
  const swaggerConfig = new DocumentBuilder()
    .setTitle("Paraderos backend")
    .setDescription("Documentacion de APIS de app para mantencion de paraderos")
    .setVersion("0.5")
    .build();
  const docs = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, docs);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

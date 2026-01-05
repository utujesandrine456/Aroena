"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useStaticAssets((0, path_1.join)(process.cwd(), 'uploads'), {
        prefix: '/uploads',
    });
    app.enableCors({
        origin: '*',
        credentials: true,
    });
    await app.listen(2009);
}
bootstrap();
//# sourceMappingURL=main.js.map
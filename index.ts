import express, { Application } from "express";
import dotenv from "dotenv";
dotenv.config();

import cors, { CorsOptions } from "cors";
import helmet from "helmet";
import compression from "compression";
import { router as dialogFlowRouter } from "./src/modules/dialogflow/routes";
import { router as prevvyRouter } from "./src/modules/prevvy/routes";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./src/util/config/swagger/swagger.json";
import rateLimit from "express-rate-limit";

const app: Application = express();

const corsOptions: CorsOptions = {
    origin: ["http://localhost:8000"],
    credentials: true,
};

//Adding middlewares
app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet());
app.use(compression());

// limit each IP to 100 requests per time
app.use(
    rateLimit({
        windowMs: parseInt(process.env.RATE_LIMIT_TIME),
        max: 100,
    })
);

//Routes
app.use("/dialog-flow/", dialogFlowRouter);
app.use("/prevvy/", prevvyRouter);

//Check enviroment to swagger docs
if (process.env.ENV === "dev") {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.listen(process.env.PORT, () => {
    console.log(`Running on port ${process.env.PORT}`);
});

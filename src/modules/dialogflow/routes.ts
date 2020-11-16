import { Router, Request, Response } from "express";
import { RedisHelper } from "../../util/data/redis-helper";
import { GoogleTranslateHelper } from "../../util/google/translate-helper";
import { DialogFlowService } from "./services";

const redis: RedisHelper = new RedisHelper(
    process.env.REDIS_HOST,
    parseInt(process.env.REDIS_PORT)
);

const translate: GoogleTranslateHelper = new GoogleTranslateHelper(
    process.env.GOOGLE_TRANSLATE_PROJECT_ID,
    process.env.GOOGLE_TRANSLATE_PROJECT_KEY
);

const dialogFlow: DialogFlowService = new DialogFlowService(redis, translate);

export const router: Router = Router();

router.post(
    "/fullfilment/",
    async (req: Request, res: Response): Promise<Response> => {
        const {
            queryText,
            parameters,
            fulfillmentMessages,
        } = req.body.queryResult;

        await dialogFlow.getPatientObservation(
            req.body.session,
            req.body.sessionId,
            queryText,
            parameters,
            fulfillmentMessages[0].text
        );

        return res.json();
    }
);

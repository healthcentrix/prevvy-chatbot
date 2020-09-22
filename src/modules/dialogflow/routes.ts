import { Router, Request, Response } from "express";
import { RedisHelper } from "../../util/data/redis-helper";
import { GoogleTranslateHelper } from "../../util/google/translate-helper";
import { DialogFlowService } from "./services";
import { IDialogFlowResponse } from "./types";

const redis: RedisHelper = new RedisHelper(
    process.env.REDIS_HOST,
    parseInt(process.env.REDIS_PORT),
    process.env.REDIS_PASSWORD
);

const translate: GoogleTranslateHelper = new GoogleTranslateHelper(
    process.env.TRANSLATE_PROJECT_ID,
    process.env.TRANSLATE_PROJECT_KEY
);

const dialogFlow: DialogFlowService = new DialogFlowService(redis, translate);

export const router: Router = Router();

router.post(
    "/fullfilment/",
    async (req: Request, res: Response): Promise<Response> => {
        const { queryText, fulfillmentMessages } = req.body.queryResult;

        const response: IDialogFlowResponse = await dialogFlow.getPatientObservation(
            req.body.session,
            req.body.sessionId,
            fulfillmentMessages,
            queryText
        );
        return res.json(response);
    }
);

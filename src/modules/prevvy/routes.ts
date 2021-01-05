import { Router, Request, Response } from "express";
import {
    IPrevvyComunicationRequest,
    IPrevvyComunicationResponse,
} from "./types";
import { TwilioHelper } from "../../util/twilio/twilio-helper";
import { RedisHelper } from "../../util/data/redis-helper";
import { GoogleTranslateHelper } from "../../util/google/translate-helper";
import { PrevvyService } from "./services";

export const router: Router = Router();

const redis: RedisHelper = new RedisHelper(
    process.env.REDIS_HOST,
    parseInt(process.env.REDIS_PORT),
    process.env.REDIS_PASS
);

const twilio: TwilioHelper = new TwilioHelper(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const translate: GoogleTranslateHelper = new GoogleTranslateHelper();

const prevvyService = new PrevvyService(redis, twilio, translate);

router.post(
    "/conversation",
    async (req: Request, res: Response): Promise<Response> => {
        const prevvyRequestBody: IPrevvyComunicationRequest = req.body;
        const response: IPrevvyComunicationResponse = await prevvyService.startPatientComunication(
            prevvyRequestBody,
            process.env.PREVVY_PHONE_NUMBER
        );
        return res.status(200).json(response);
    }
);

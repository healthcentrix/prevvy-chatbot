import {
    IPrevvyComunicationRequest,
    IPrevvyComunicationResponse,
    IPrevvyComunicationData,
} from "./types";

export class PrevvyService {
    private redis: any;
    private twilio: any;
    private translate: any;

    constructor(redis: any, twilio: any, translate: any) {
        this.redis = redis;
        this.twilio = twilio;
        this.translate = translate;
    }

    public async startPatientComunication(
        {
            codeObservation,
            communicationRequestID,
            lang,
            patientLang,
            observations,
            patientRef,
            phoneNumber,
            unitType,
        }: IPrevvyComunicationRequest,
        toNumber: string
    ): Promise<IPrevvyComunicationResponse> {
        const response: IPrevvyComunicationResponse = { status: false };
     

        let translateObservation: string;

        try {
            translateObservation = await this.translate.translate(
                observations[0],
                patientLang
            );
        } catch (error) {
            response["error"] = error;
            return error;
        }

        try {
            const comunicationData: IPrevvyComunicationData = {
                lang: lang,
                patientLang: patientLang,
                responses: [],
                responseCount: 0,
                observationsCount: observations.length,
                communicationRequestID: communicationRequestID,
                codeObservation: codeObservation,
                unitType: unitType,
            };

            const [messageResponseId] = await Promise.all([
                this.twilio.sendSMS(
                    phoneNumber,
                    toNumber,
                    translateObservation
                ),
                this.redis.setString(
                    phoneNumber,
                    JSON.stringify(comunicationData),
                    1800
                ),
            ]);
            response["status"] = true;
            response["message_id"] = messageResponseId;
            return response;
        } catch (error) {
            response["error"] = error;
            return error;
        }
    }
}

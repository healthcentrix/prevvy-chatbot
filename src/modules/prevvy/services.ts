import {
    IPrevvyComunicationRequest,
    IPrevvyComunicationResponse,
    IPrevvyComunicationData,
    CommunicationMedium,
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
            communication_request_id: communicationRequestID,
            dialog_type: dialogType,
            message_text: messageText,
            mobile_phone_number: mobilePhoneNumber,
            user_id: userId,
            user_name: userName,
            message_html: messageHtml,
            title,
            name,
            time,
            medium,
            language,
        }: IPrevvyComunicationRequest,
        fromNumber: string
    ): Promise<IPrevvyComunicationResponse> {
        const response: IPrevvyComunicationResponse = { status: false };

        let messageToTranslate = messageText;

        if (medium !== CommunicationMedium.SMS) {
            messageToTranslate = messageHtml;
        }

        let translatedMessage = messageToTranslate;

        try {
            translatedMessage = await this.translate.translate(
                messageToTranslate,
                language
            );

            switch (medium) {
                case CommunicationMedium.SMS:
                    await this.twilio.sendSMS(
                        fromNumber,
                        mobilePhoneNumber,
                        translatedMessage
                    );

                    break;
                default:
                    break;
            }

            const prevvyComunicationData: IPrevvyComunicationData = {
                communicationRequestID,
                dialogType,
                language,
                medium,
                name,
                time,
                title,
                userId,
                userName,
            };

            await this.redis.setString(
                mobilePhoneNumber,
                JSON.stringify(prevvyComunicationData),
                parseInt(process.env.REDIS_EXPIRATION_KEY)
            );

            response.status = true;
        } catch (error) {
            response.error = error;
        } finally {
            return response;
        }
    }
}

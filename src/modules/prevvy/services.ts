import {
    IPrevvyComunicationRequest,
    IPrevvyComunicationResponse,
    IPrevvyComunicationData,
    CommunicationMedium,
    IPrevvySendSMSResponse,
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
            dialog_sub_type: dialogSubType,
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

        let translatedMessage = messageToTranslate;

        try {
            translatedMessage = await this.translate.translate(
                messageToTranslate,
                language
            );

            switch (medium) {
                case CommunicationMedium.SMS:
                    await this.sendSMS(
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
                dialogSubType,
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

    public async sendSMS(
        fromNumber: string,
        mobile: string,
        message: string
    ): Promise<IPrevvySendSMSResponse> {
        let response: IPrevvySendSMSResponse = {
            status: false,
        };
        try {
            const messageId = await this.twilio.sendSMS(
                fromNumber,
                mobile,
                message
            );

            response = {
                status: true,
                message_id: messageId,
            };
        } catch (error) {
            console.log(error);

            let errorMessage = "Network Error";
            if (error.response) {
                errorMessage = error.response;
            }

            response.error_message = errorMessage;
        }

        return response;
    }
}

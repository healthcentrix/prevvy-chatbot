import { Twilio } from "twilio";
import { MessageInstance } from "twilio/lib/rest/api/v2010/account/message";

export class TwilioHelper {
    private client: Twilio;

    constructor(accountSid: string, authToken: string) {
        this.client = new Twilio(accountSid, authToken);
    }

    public async sendSMS(
        fromNumber: string,
        toNumber: string,
        body: string
    ): Promise<string> {
        const message: MessageInstance = await this.client.messages.create({
            from: fromNumber,
            to: toNumber,
            body: body,
        });
        return message.messagingServiceSid;
    }
}

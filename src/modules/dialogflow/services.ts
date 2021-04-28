import {
    IPrevvyComunicationData,
    DialogType,
    DialogSubType,
} from "../prevvy/types";
import _ from "lodash";
import {
    IPrevvyFeedBackData,
    IDialogFlowParameter,
    Codes,
    IValue,
} from "./types";
import axios from "axios";

export class DialogFlowService {
    private redis: any;
    private translate: any;

    constructor(redis: any, translate: any) {
        this.redis = redis;
        this.translate = translate;
    }

    public async getPatientObservation(
        sessionAgent: any,
        sessionId: string,
        queryText: string,
        parameters: IDialogFlowParameter,
        fullfilment: string
    ): Promise<string> {
        const splittedSession: string = _.split(sessionAgent, "/sessions/")[1];
        const session: string = sessionId || splittedSession;

        const stringData: string = await this.redis.getString(session);
        const data: IPrevvyComunicationData = JSON.parse(stringData);

        console.log("***Data");
        console.log(data);

        if (data) {
            let feedBackData: IPrevvyFeedBackData = {};

            switch (data.dialogType) {
                case DialogType.MONITORING_ACTIVITY:
                    feedBackData = this.monitoringFitnessActivity(
                        data.dialogSubType,
                        data.communicationRequestID,
                        parameters
                    );

                    break;

                default:
                    break;
            }

            let textResponse =
                "Thanks for your reply to the questionnaire. Prevvy has registered your answers in your Personal Health Record.";

            try {
                /*              await Promise.all([
                    axios.post(process.env.PREVVY_FEEDBACK_URL, feedBackData),
                    this.redis.removeKey(session),
                ]);
*/

                // await this.redis.removeKey(session);
                console.log("***Feedback");
                console.log(feedBackData);
            } catch (error) {
                console.log(error);
                textResponse = "An error occurred please try again";
            }

            const translateResponse = await this.translate.translate(
                textResponse,
                data.language || "en"
            );

            return translateResponse;
        }

        return "Sorry, I don't understand your request. I haven't asked you any request";
    }

    private monitoringFitnessActivity(
        subType: DialogSubType,
        communicationRequestID: string,
        parameters: IDialogFlowParameter
    ): IPrevvyFeedBackData {
        let values: Array<IValue> = [];
        switch (subType) {
            case DialogSubType.BLOOD_PRESSURE:
                values = [
                    {
                        code: Codes.SYSTOLIC,
                        metric_name: "Systolic",
                        value: parameters.systolic,
                    },
                    {
                        code: Codes.DIASTOLIC,
                        metric_name: "Diastolic",
                        value: parameters.diastolic,
                    },
                    {
                        code: Codes.HEART_RATE,
                        metric_name: "Heart Rate",
                        value: parameters.heart_rate,
                    },
                ];

                return {
                    communication_request_id: communicationRequestID,
                    done: true,
                    values: values,
                };

            case DialogSubType.GLUCOSE:
                values = [
                    {
                        code: Codes.GLUCOSE,
                        metric_name: "Glucose",
                        value: parameters.glucose,
                    },
                ];

                return {
                    communication_request_id: communicationRequestID,
                    done: true,
                    values: values,
                };
            case DialogSubType.OXYGEN:
                values = [
                    {
                        code: Codes.OXYGEN,
                        metric_name: "Oxygen",
                        value: parameters.oxygen,
                    },
                ];

                return {
                    communication_request_id: communicationRequestID,
                    done: true,
                    values: values,
                };
            case DialogSubType.TEMPERATURE:
                values = [
                    {
                        code: Codes.TEMPERATURE,
                        metric_name: "Temperature",
                        value: parameters.temperature,
                    },
                ];

                return {
                    communication_request_id: communicationRequestID,
                    done: true,
                    values: values,
                };
        }
    }
}

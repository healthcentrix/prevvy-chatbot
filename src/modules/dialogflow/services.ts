import { IPrevvyComunicationData, DialogType } from "../prevvy/types";
import _ from "lodash";
import { IPrevvyFeedBackData, IDialogFlowParameter } from "./types";
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
    ): Promise<void> {
        const splittedSession: string = _.split(sessionAgent, "/sessions/")[1];
        const session: string = sessionId || splittedSession;

        const stringData: string = await this.redis.getString(session);
        const data: IPrevvyComunicationData = JSON.parse(stringData);

        if (data) {
            let feedBackData: IPrevvyFeedBackData = {};

            switch (data.dialogType) {
                case DialogType.MONITORING_ACTIVITY:
                case DialogType.FITNESS_ACTIVITY:
                    feedBackData = this.monitoringFitnessActivity(
                        parameters,
                        data.communicationRequestID
                    );
                    break;

                case DialogType.ASSESMENT:
                    feedBackData = this.assesmentActivity(
                        fullfilment,
                        data.communicationRequestID
                    );
                    break;
                case DialogType.MEDICATION_ACTIVITY:
                case DialogType.APPOINMENT_ACTIVITY:
                    feedBackData = await this.medicationAppoinmentActivity(
                        queryText,
                        data.communicationRequestID
                    );
                    break;

                default:
                    break;
            }

            try {
                console.log("Response to prevvy");
                console.log(feedBackData);
                await axios.post(process.env.PREVVY_FEEDBACK_URL, feedBackData);
            } catch (error) {
                console.log("Error");
                console.log(error);
            }
        }
    }

    private monitoringFitnessActivity(
        parameters: IDialogFlowParameter,
        communicationRequestID: string
    ): IPrevvyFeedBackData {
        const done = parameters !== null && parameters !== {};
        const feedBackData: IPrevvyFeedBackData = {
            communication_request_id: communicationRequestID,
            done: done,
        };
        if (done) {
            feedBackData.capture_secuence = parameters;
        }
        return feedBackData;
    }

    private async medicationAppoinmentActivity(
        queryText: string,
        communicationRequestID
    ): Promise<IPrevvyFeedBackData> {
        const translatedQuery = await this.translate.translate(queryText, "en");

        const done = !_.includes(_.toLower(translatedQuery), "no");
        const feedBackData: IPrevvyFeedBackData = {
            communication_request_id: communicationRequestID,
            done: done,
        };

        if (!done) {
            feedBackData.reason_not_done = translatedQuery;
        }

        return feedBackData;
    }

    private assesmentActivity(
        fullfilment: string,
        communicationRequestID
    ): IPrevvyFeedBackData {
        const feedBackData: IPrevvyFeedBackData = {
            communication_request_id: communicationRequestID,
            done: true,
            questionnarie: fullfilment,
        };

        return feedBackData;
    }
}

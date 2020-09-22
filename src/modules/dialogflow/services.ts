import {IPrevvyComunicationData} from "../prevvy/types"
import _ from "lodash"
import {IDialogFlowResponse} from "./types"

export class DialogFlowService{
    private redis: any;
    private translate: any;

    constructor(redis: any, translate: any){
        this.redis = redis;
        this.translate = translate;
    }

    public async getPatientObservation(sessionAgent: any, sessionId: string ,fullFillmentMessages: Array<any>, queryText: string): Promise<IDialogFlowResponse>{
        const response: IDialogFlowResponse = {
            fulfillmentMessages: fullFillmentMessages,
        };
        const splittedSession: string = _.split(sessionAgent, "/sessions/") [1];
        const session: string = sessionId || splittedSession;

        const stringData: string = await this.redis.getString(session);
        const data: IPrevvyComunicationData = JSON.parse(stringData);

        if(!data){
            response.fulfillmentText = 'Request cannot be answered';   
            response.fulfillmentMessages[0].text[0] = 'Request cannot be answered';  
            return response;
        }

        let prevvyResponse: string, translatedFullfilmentMessage: string;

        try {

        [prevvyResponse, translatedFullfilmentMessage] = await Promise.all([this.translate.translate(queryText, data.lang),this.translate.translate(fullFillmentMessages[0].text[0], data.patientLang)])
       
        } catch (error) {
            response.fulfillmentText = 'Request cannot be answered';   
            response.fulfillmentMessages[0].text[0] = 'Request cannot be answered';  
            return response;
        }
       
        data.responses.push(prevvyResponse);
        ++data.responseCount;

        if(data.responseCount === data.observationsCount){
            //Send observations to Prevvy

            this.redis.removeKey(session);
            return response;
        }

        await this.redis.setString(session, JSON.stringify(data))

        response.fulfillmentText = translatedFullfilmentMessage;     
        return response;
 }

}
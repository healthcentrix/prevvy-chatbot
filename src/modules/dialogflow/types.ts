interface IDialogFlowMessage{
    text: Array<string>;
}

interface IDialogFlowFullfilmentMessage{
    text: IDialogFlowMessage;
}


export interface IDialogFlowResponse{
    fulfillmentText?: string;
    fulfillmentMessages: Array<IDialogFlowFullfilmentMessage>;
}
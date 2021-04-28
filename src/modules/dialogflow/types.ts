export interface IDialogFlowParameter {
    systolic?: number;
    diastolic?: number;
    heart_rate?: number;
    weigth?: number;
    glucose?: number;
    oxygen?: number;
    temperature?: number;
    distance?: number;
    steps?: number;
    time?: number;
    calories?: number;
    floor?: number;
}

export interface IValue {
    metric_name: string;
    code: string;
    value: string | number;
}

export interface IPrevvyFeedBackData {
    communication_request_id?: string;
    done?: boolean;
    values?: Array<IValue>;
    reason_not_done?: string;
    questionnarie?: string;
}

export enum Codes {
    SYSTOLIC = "8480-6",
    DIASTOLIC = "8462-4",
    HEART_RATE = "64113-4",
    GLUCOSE = "2339-0",
    TEMPERATURE = "8310-5",
    OXYGEN = "59408-5",
}

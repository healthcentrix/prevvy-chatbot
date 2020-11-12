export interface IDialogFlowParameter {
    systolic?: number;
    diastolic?: number;
    pulse?: number;
    weigth?: number;
    glucose?: number;
    blood_oxygen?: number;
    temperature?: number;
    heart_rate?: number;
    distance?: number;
    steps?: number;
    time?: number;
    calories?: number;
    floor?: number;
}

export interface IPrevvyFeedBackData {
    communication_request_id?: string;
    done?: boolean;
    capture_secuence?: IDialogFlowParameter;
    reason_not_done?: string;
    questionnarie?: string;
}

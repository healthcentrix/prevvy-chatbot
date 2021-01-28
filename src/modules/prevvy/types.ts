export enum CommunicationMedium {
    SMS = "sms",
    CHAT = "chat",
    GOOGLE_ASSISTANT = "gassistant",
    ALEXA = "alexa",
}

export enum DialogType {
    MONITORING_ACTIVITY = "MONITORING_ACTIVITY",
    FITNESS_ACTIVITY = "FITNESS_ACTIVITY",
    MEDICATION_ACTIVITY = "MEDICATION_ACTIVITY",
    APPOINMENT_ACTIVITY = "APPOINMENT_ACTIVITY",
    ASSESMENT = "ASSESMENT",
}

export interface IPrevvyComunicationRequest {
    dialog_type: DialogType;
    communication_request_id: string;
    medium: CommunicationMedium;
    language: string;
    user_id: string;
    user_name: string;
    name: string;
    title: string;
    mobile_phone_number: string;
    message_text: string;
    message_html?: string;
    time: string;
}

export interface IPrevvyComunicationResponse {
    status: boolean;
    error?: string;
}

export interface IPrevvyComunicationData {
    dialogType: DialogType;
    communicationRequestID: string;
    medium: CommunicationMedium;
    language: string;
    userId: string;
    userName: string;
    name: string;
    title: string;
    time: string;
}

export interface IPrevvySendSMSResponse {
    status: boolean;
    messageId?: string;
    error_message?: string;
}

export interface IPrevvySendSMSRequest {
    message: string;
    mobile: string;
}

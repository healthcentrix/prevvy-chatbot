enum CommunicationMedium {
    SMS = "sms",
    CHAT = "chat",
    GOOGLE_ASSISTANT = "gassistant",
    ALEXA = "alexa",
}

enum DialogType {
    MONITORING_ACTIVITY = "MONITORING_ACTIVITY",
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
    message_id?: string;
}

export interface IPrevvyComunicationData {
    responseCount: number;
    responses: Array<string>;
    observationsCount: number;
    communicationRequestID: string;
    codeObservation: string;
    lang: string;
    patientLang: string;
    unitType: string;
}

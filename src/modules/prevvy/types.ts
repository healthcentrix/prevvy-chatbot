export interface IPrevvyComunicationRequest {
    communicationRequestID: string;
    patientRef: string;
    codeObservation: string;
    phoneNumber: string;
    unitType: string;
    observations: Array<string>;
    patientLang: string;
    lang: string;
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

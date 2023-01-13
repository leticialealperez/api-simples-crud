export interface Contact {
    id: string;
    name: string;
    phone: string;
}

export interface ResponseAPI {
    success: boolean;
    message: string;
    data: any;
}
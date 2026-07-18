export declare class WebhookService {
    verifyXSignature(payload: string, signature: string, clientSecret: string): boolean;
    verifyCRC(crcToken: string, clientSecret: string): {
        response_token: string;
    };
}

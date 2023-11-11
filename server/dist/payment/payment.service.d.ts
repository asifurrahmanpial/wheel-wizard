import Stripe from 'stripe';
export declare class PaymentService {
    private stripe;
    constructor();
    createPaymentIntent(email: string, amount: number): Promise<Stripe.Response<Stripe.PaymentIntent>>;
}

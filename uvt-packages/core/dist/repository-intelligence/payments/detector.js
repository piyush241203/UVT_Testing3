"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsDetector = void 0;
class PaymentsDetector {
    name = 'PaymentsDetector';
    async detect(context) {
        const deps = context.dependencies;
        let payments = 'None';
        let confidence = 0.1;
        const evidence = [];
        const checks = [
            { name: 'Stripe', dep: '@stripe/stripe-js' },
            { name: 'Stripe', dep: 'stripe' },
            { name: 'PayPal', dep: '@paypal/react-paypal-js' },
            { name: 'Razorpay', dep: 'razorpay' },
            { name: 'Square', dep: '@square/web-sdk' },
            { name: 'Braintree', dep: 'braintree-web' }
        ];
        for (const check of checks) {
            if (deps[check.dep]) {
                payments = check.name;
                confidence = 1.0;
                evidence.push(`Found dependency "${check.dep}".`);
                break;
            }
        }
        context.capabilities.set('payments', {
            id: 'payments',
            type: 'payments',
            name: payments,
            confidence,
            evidence,
            dependencies: []
        });
    }
}
exports.PaymentsDetector = PaymentsDetector;
//# sourceMappingURL=detector.js.map
import { serve } from '@novu/framework/next';
import { adoptionStatusChanged } from 'lib/novu/workflows/adoption-status-changed';
import { adoptionSubmitted } from 'lib/novu/workflows/adoption-submitted';
import { messageReceived } from 'lib/novu/workflows/message-received';
import { reservationFeePaid } from 'lib/novu/workflows/reservation-fee-paid';
import { finalPaymentCompleted } from 'lib/novu/workflows/final-payment-completed';
import { breedMatchFound } from 'lib/novu/workflows/breed-match-found';
import { breederApplicationSubmitted } from 'lib/novu/workflows/breeder-application-submitted';
import { breederVerified } from 'lib/novu/workflows/breeder-verified';
import { listingCreated } from 'lib/novu/workflows/listing-created';
import { newUserSignup } from 'lib/novu/workflows/new-user-signup';
import { otpLogin } from 'lib/novu/workflows/otp-login';
import { passwordReset } from 'lib/novu/workflows/password-reset';
import { payoutBatchProcessed } from 'lib/novu/workflows/payout-batch-processed';
import { payoutProcessed } from 'lib/novu/workflows/payout-processed';
import { verifyEmail } from 'lib/novu/workflows/verify-email';
import { welcomeUser } from 'lib/novu/workflows/welcome-user';
import { adminBroadcast } from 'lib/novu/workflows/admin-broadcast';
import { breederActivityBroadcast } from 'lib/novu/workflows/breeder-activity-broadcast';

export const { GET, POST } = serve({
  workflows: [
    adoptionStatusChanged,
    adoptionSubmitted,
    messageReceived,
    reservationFeePaid,
    finalPaymentCompleted,
    breedMatchFound,
    breederApplicationSubmitted,
    breederVerified,
    listingCreated,
    newUserSignup,
    otpLogin,
    passwordReset,
    payoutBatchProcessed,
    payoutProcessed,
    verifyEmail,
    welcomeUser,
    adminBroadcast,
    breederActivityBroadcast,
  ],
});

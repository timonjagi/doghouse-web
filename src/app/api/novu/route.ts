import { serve } from '@novu/framework/next';
import { adoptionStatusChanged } from '../../../../novu/workflows/adoption-status-changed';
import { adoptionSubmitted } from '../../../../novu/workflows/adoption-submitted';
import { messageReceived } from '../../../../novu/workflows/message-received';
import { reservationFeePaid } from '../../../../novu/workflows/reservation-fee-paid';
import { finalPaymentCompleted } from '../../../../novu/workflows/final-payment-completed';
import { breedMatchFound } from '../../../../novu/workflows/breed-match-found';
import { breederApplicationSubmitted } from '../../../../novu/workflows/breeder-application-submitted';
import { breederVerified } from '../../../../novu/workflows/breeder-verified';
import { listingCreated } from '../../../../novu/workflows/listing-created';
import { newUserSignup } from '../../../../novu/workflows/new-user-signup';
import { otpLogin } from '../../../../novu/workflows/otp-login';
import { passwordReset } from '../../../../novu/workflows/password-reset';
import { payoutBatchProcessed } from '../../../../novu/workflows/payout-batch-processed';
import { payoutProcessed } from '../../../../novu/workflows/payout-processed';
import { verifyEmail } from '../../../../novu/workflows/verify-email';
import { welcomeUser } from '../../../../novu/workflows/welcome-user';
import { adminBroadcast } from '../../../../novu/workflows/admin-broadcast';

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
  ],
});

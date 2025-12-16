import { defineConfig } from '@novu/framework';

// Import all workflows
import { welcomeUser } from './workflows/welcome-user';
import { verifyEmail } from './workflows/verify-email';
import { passwordReset } from './workflows/password-reset';
import { otpLogin } from './workflows/otp-login';
import { breederVerified } from './workflows/breeder-verified';
import { breedMatchFound } from './workflows/breed-match-found';
import { reservationFeePaid } from './workflows/reservation-fee-paid';
import { finalPaymentCompleted } from './workflows/final-payment-completed';
import { adoptionSubmitted } from './workflows/adoption-submitted';
import { listingCreated } from './workflows/listing-created';
import { newUserSignup } from './workflows/new-user-signup';
import { adoptionStatusChanged } from './workflows/adoption-status-changed';
import { payoutProcessed } from './workflows/payout-processed';
import { payoutBatchProcessed } from './workflows/payout-batch-processed';

export default defineConfig({
  applicationIdentifier: process.env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER!,
  workflows: [
    welcomeUser,
    verifyEmail,
    passwordReset,
    otpLogin,
    breederVerified,
    breedMatchFound,
    reservationFeePaid,
    finalPaymentCompleted,
    adoptionSubmitted,
    listingCreated,
    newUserSignup,
    adoptionStatusChanged,
    payoutProcessed,
    payoutBatchProcessed,
  ],
});
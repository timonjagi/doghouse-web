// Reusable email templates for Novu workflows

export interface EmailTemplateData {
  logoUrl?: string;
  title: string;
  greeting: string;
  content: string;
  details?: Array<{ label: string; value: string }>;
  actionButton?: { text: string; url: string };
  footerContent?: string;
  nextSteps?: string[];
  unsubscribeUrl?: string;
  privacyUrl?: string;
}

export function createProfessionalEmailTemplate(data: EmailTemplateData): string {
  const {
    logoUrl = 'https://your-domain.com/logo.png',
    title,
    greeting,
    content,
    details,
    actionButton,
    footerContent,
    nextSteps,
    unsubscribeUrl = 'https://your-domain.com/unsubscribe',
    privacyUrl = 'https://your-domain.com/privacy'
  } = data;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        .email-container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { max-width: 150px; }
        .title { color: #2d3748; margin-bottom: 20px; font-size: 24px; }
        .greeting { margin-bottom: 20px; }
        .content { margin-bottom: 20px; }
        .details { background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-item { margin-bottom: 8px; }
        .detail-label { font-weight: bold; color: #2d3748; }
        .action-button { text-align: center; margin: 30px 0; }
        .action-btn { background-color: #3182ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
        .next-steps { margin: 20px 0; }
        .next-steps ul { padding-left: 20px; }
        .footer { text-align: center; color: #718096; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; }
        .footer a { color: #718096; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <img src="${logoUrl}" alt="Pethouse" class="logo">
        </div>

        <h1 class="title">${title}</h1>

        <p class="greeting">${greeting}</p>

        <div class="content">${content}</div>

        ${details ? `
          <div class="details">
            ${details.map(detail => `
              <div class="detail-item">
                <span class="detail-label">${detail.label}:</span> ${detail.value}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${nextSteps ? `
          <div class="next-steps">
            <strong>What happens next?</strong>
            <ul>
              ${nextSteps.map(step => `<li>${step}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${actionButton ? `
          <div class="action-button">
            <a href="${actionButton.url}" class="action-btn">${actionButton.text}</a>
          </div>
        ` : ''}

        ${footerContent ? `<p>${footerContent}</p>` : ''}

        <div class="footer">
          <p>You're receiving this email because you have an active account with Pethouse.</p>
          <p><a href="${unsubscribeUrl}">Unsubscribe</a> | <a href="${privacyUrl}">Privacy Policy</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Specific email templates for different use cases

export function createAdoptionStatusEmail(seekerName: string, title: string, body: string, adoptionId: string, listingTitle: string, status: string): string {
  return createProfessionalEmailTemplate({
    title,
    greeting: `Hi ${seekerName},`,
    content: body,
    details: [
      { label: 'Listing', value: listingTitle },
      { label: 'Status', value: status },
      { label: 'Application ID', value: adoptionId }
    ],
    actionButton: {
      text: 'View Adoption Details',
      url: `https://your-domain.com/dashboard/adoptions/${adoptionId}`
    },
    footerContent: 'If you have any questions, please don\'t hesitate to contact our support team.',
  });
}

export function createAdoptionSubmittedEmail(seekerName: string, listingTitle: string, adoptionId: string): string {
  return createProfessionalEmailTemplate({
    title: 'Adoption Application Submitted',
    greeting: `Hi ${seekerName},`,
    content: 'Thank you for submitting your adoption application! Your application has been received and is being reviewed by the breeder.',
    details: [
      { label: 'Listing', value: listingTitle },
      { label: 'Application ID', value: adoptionId },
      { label: 'Status', value: 'Under Review' }
    ],
    nextSteps: [
      'The breeder will review your application within 24-48 hours',
      'You\'ll receive a notification when there\'s an update',
      'If approved, you\'ll be able to proceed with payment and adoption'
    ],
    actionButton: {
      text: 'Track Your Application',
      url: `https://your-domain.com/dashboard/adoptions/${adoptionId}`
    },
  });
}

export function createNewApplicationEmail(breederName: string, listingTitle: string, seekerName: string, adoptionId: string): string {
  return createProfessionalEmailTemplate({
    title: 'New Adoption Application Received',
    greeting: `Hi ${breederName},`,
    content: 'Great news! A new adoption application has been submitted for your listing.',
    details: [
      { label: 'Listing', value: listingTitle },
      { label: 'Applicant', value: seekerName },
      { label: 'Application ID', value: adoptionId }
    ],
    actionButton: {
      text: 'Review Application',
      url: `https://your-domain.com/dashboard/listings/${adoptionId}/applications`
    },
    footerContent: 'Please review the application and let the seeker know your decision within 24-48 hours.',
  });
}

export function createPaymentConfirmationEmail(seekerName: string, paymentType: string, listingTitle: string, amount: string): string {
  const isReservation = paymentType === 'reservation';
  return createProfessionalEmailTemplate({
    title: `${isReservation ? 'Reservation' : 'Final'} Payment Confirmed`,
    greeting: `Hi ${seekerName},`,
    content: `Your ${paymentType} payment has been confirmed. ${isReservation ? 'The listing is now reserved for you.' : 'Your adoption is now complete!'}`,
    details: [
      { label: 'Listing', value: listingTitle },
      { label: 'Payment Type', value: paymentType },
      { label: 'Amount', value: `₦${amount}` }
    ],
  });
}

export function createWelcomeEmail(firstName: string): string {
  return createProfessionalEmailTemplate({
    title: 'Welcome to Pethouse!',
    greeting: `Hi ${firstName},`,
    content: 'Welcome to Pethouse! We\'re excited to have you join our community of verified breeders and responsible pet seekers.',
    nextSteps: [
      'Complete your profile to get better matches',
      'Start exploring available listings',
      'Connect with verified breeders in your area'
    ],
    actionButton: {
      text: 'Explore Listings',
      url: 'https://your-domain.com/explore'
    },
  });
}

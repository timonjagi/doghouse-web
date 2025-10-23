import type { NextApiRequest, NextApiResponse } from 'next';

const WHAPI_AUTH_TOKEN = 'WcjjsTTvet1Y1rbWNfMRWRQUzLNtlopd';
const WHAPI_SERVER = 'https://gate.whapi.cloud';
const GROUP_ID = '120363404757432021@g.us';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { body } = req;
    const fields = body.data?.fields || [];

    // Extract form fields
    let name = '';
    let phone = '';
    let breed = '';
    let agePreference = '';
    let genderPreference = '';

    for (const field of fields) {
      if (field.key === 'question_oblYgP') {
        name = field.value;
      }
      if (field.key === 'question_9q2YBV') {
        phone = field.value;
      }
      if (field.key === 'question_1VXvvl') {
        breed = field.value;
      }
      if (field.key === 'question_MRXYYA') {
        agePreference = field.value;
      }
      if (field.key === 'question_gGaZZ4') {
        genderPreference = field.value;
      }
    }

    if (!name || !phone) {
      return res.status(400).json({ message: 'Name or phone not found in payload' });
    }

    // Format phone for WhatsApp (remove +)
    const formattedPhone = phone.replace(/^\+/, '');

    // Send acknowledgment message
    const acknowledgmentMessage = `Thank you ${name} for your interest in adopting a ${breed} ${agePreference} ${genderPreference}. We'll get back to you soon!`;

    await fetch(`${WHAPI_SERVER}/messages/text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WHAPI_AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        to: formattedPhone,
        body: acknowledgmentMessage,
      }),
    });

    // Add to group
    await fetch(`${WHAPI_SERVER}/groups/${GROUP_ID}/participants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WHAPI_AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        participants: [formattedPhone],
      }),
    });

    // Send welcome message to group
    const welcomeMessage = `Welcome ${name} to the Doghouse community! We're excited to have you here.`;

    await fetch(`${WHAPI_SERVER}/messages/text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WHAPI_AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        to: GROUP_ID,
        body: welcomeMessage,
      }),
    });

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

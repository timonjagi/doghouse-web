import type { NextApiRequest, NextApiResponse } from "next";

import { auth } from "lib/firebase/admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { uid, isBreeder } = req.body;

    // verify id token
    // Set custom claims on the user
    await auth.setCustomUserClaims(uid, { isBreeder });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error });
  }
}

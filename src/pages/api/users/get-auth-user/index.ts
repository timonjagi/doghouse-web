import type { NextApiRequest, NextApiResponse } from "next";

import { auth } from "lib/firebase/admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { phoneNumber } = req.query;
    console.log(phoneNumber);

    if (phoneNumber) {
      const user = await auth.getUserByPhoneNumber(phoneNumber as string);

      res.status(200).json({ user });
    } else {
      throw new Error("Phone number not found");
    }
    // eslint-disable-next-line
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      res.status(404).json({ error });
    } else {
      res.status(500).json({ error });
    }
  }
}

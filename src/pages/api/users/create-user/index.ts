import type { NextApiRequest, NextApiResponse } from "next";

import { fireStore } from "lib/firebase/client";
import { doc, setDoc } from 'firebase/firestore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { payload } = req.body;
    if (payload) {
      await setDoc(doc(fireStore, "users", payload.userId), payload);

      res.status(200).json({ success: true });
    } else {
      throw new Error();
    }
    // eslint-disable-next-line
  } catch (error: any) {
    res.status(500).json({ error });
  }
}

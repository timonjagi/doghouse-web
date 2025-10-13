import type { NextApiRequest, NextApiResponse } from "next";

import { fireStore } from "lib/firebase/client";
import { doc, getDoc } from 'firebase/firestore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { uid } = req.query;
    if (uid) {
      const docRef = doc(fireStore, "users", uid as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const user = docSnap.data()
        console.log("Document data:", user);
        return res.status(200).json({ ...user })
      } else {
        console.log("No such document!");
        return res.status(404).json({ message: 'User not found' });
      }
    } else {
      throw new Error('Bad Request: uid must be present');
    }
    // eslint-disable-next-line
  } catch (error: any) {
    res.status(500).json({ error });
  }
}

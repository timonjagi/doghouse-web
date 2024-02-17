import { collection, getDocs, query, where } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

import { fireStore } from "lib/firebase/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { breedName } = req.query;
    const querySnapshot = await getDocs(
      query(collection(fireStore, "breeds"), where("name", "==", breedName))
    );

    const breedDoc = querySnapshot.docs.map((doc) => doc)[0];

    res.status(200).json({ id: breedDoc.id, ...breedDoc.data() });
  } catch (error) {
    res.json(error);
    res.status(500).end();
  }
}

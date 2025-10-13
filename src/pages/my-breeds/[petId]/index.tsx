import { doc, getDoc } from "firebase/firestore";

import { fireStore } from "lib/firebase/client";
import { GetServerSidePropsContext } from "next";
import safeJsonStringify from "safe-json-stringify";
import breedData from "../../../lib/data/breeds_with_group.json";
import BreedProfile from "lib/pages/my-breeds/BreedProfile";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const petDocRef = doc(fireStore, "pets", context.query.petId as string);

  const petDoc = await getDoc(petDocRef);
  const pet = petDoc.exists()
    ? JSON.parse(safeJsonStringify({ id: petDoc.id, ...petDoc.data() }))
    : "";

  return {
    props: {
      petData: pet,
    },
  };
}

const UserBreedDetailPage = ({ petData }) => {
  return <BreedProfile />;
};

export default UserBreedDetailPage;

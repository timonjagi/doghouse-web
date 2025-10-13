import { doc, getDoc } from "firebase/firestore";

import { fireStore } from "lib/firebase/client";
import { GetServerSidePropsContext } from "next";
import safeJsonStringify from "safe-json-stringify";
// import breedData from "../../../lib/data/breeds_with_group.json";
import BreedProfile from "lib/pages/account/breeds/BreedProfile";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const userBreedDocRef = doc(fireStore, "userBreeds", context.query.userBreedId as string);

  const userBreedDoc = await getDoc(userBreedDocRef);
  const userBreed = userBreedDoc.exists()
    ? JSON.parse(safeJsonStringify({ id: userBreedDoc.id, ...userBreedDoc.data() }))
    : "";

  return {
    props: {
      userBreedData: userBreed,
    },
  };
}

const UserBreedDetailPage = ({ userBreedData }) => {
  return <BreedProfile />;
};

export default UserBreedDetailPage;

import { doc, getDoc } from "firebase/firestore";

import { fireStore } from "lib/firebase/client";
import { PetDetail } from "lib/pages/account/pets/pet-detail";
import { GetServerSidePropsContext } from "next";
import safeJsonStringify from "safe-json-stringify";
import breedData from "../../../../lib/data/breeds_with_group.json";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const petDocRef = doc(fireStore, "pets", context.query.petId as string);

  const petDoc = await getDoc(petDocRef);
  const pet = petDoc.exists()
    ? JSON.parse(safeJsonStringify({ id: petDoc.id, ...petDoc.data() }))
    : "";

  pet.breedGroup = breedData.find(
    (breed) => breed.name === pet.breed
  ).breedGroup;

  return {
    props: {
      petData: pet,
    },
  };
}

const PetDetailPage = ({ petData }) => {
  return <PetDetail pet={petData} />;
};

export default PetDetailPage;

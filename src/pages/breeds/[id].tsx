import {
  Box,
  Container,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";

import type { Breed } from "lib/models/breed";
import BreedDetails from "lib/pages/breeds/breed-details";

const BreedDetailPage = () => {
  const router = useRouter();
  const [selectedBreed, setSelectedBreed] = useState({} as Breed);
  const breedName = router.query.breedName as string;
  const [loading, setLoading] = useState(false);
  const isMobile = useBreakpointValue({
    base: true,
    lg: false,
  });

  useEffect(() => {
    router.prefetch("/breeds");
  }, [router]);

  return (
    <Box as="section" h="100vh" overflowY="auto">
      <Container
        h="100vh"
        pt={{
          base: "4",
          lg: "8",
        }}
        pb={{
          base: "12",
          lg: "24",
        }}
      >
        {breedName && (
          <>
            <IconButton
              aria-label="Back to breeds"
              variant="ghost"
              size="xs"
              onClick={() => router.back()}
              as={IoChevronBackOutline}
              px={0}
            />
            <BreedDetails
              breedName={breedName}
              selectedBreed={selectedBreed}
              setSelectedBreed={setSelectedBreed}
              loading={loading}
              setLoading={setLoading}
              isMobile={isMobile}
              isDrawer={false}
            />
          </>
        )}
      </Container>
    </Box>
  );
};
export default BreedDetailPage;

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   let breedName = context.query.breedName as string;
//   breedName = breedName.replace(/-/g, " ");

//   const querySnapshot = await getDocs(
//     query(collection(fireStore, "breeds"), where("name", "==", breedName))
//   );

//   const breed = querySnapshot.docs.map((doc) => doc)[0];

//   return {
//     props: {
//       breed: { id: breed.id, ...breed.data() },
//       breedName,
//     },
//   };
// }
import {
  Box,
  Container,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import BreedDetails from "lib/pages/breeds/breed-details";
import Head from "next/head";
import Footer from "lib/components/layout/Footer";

const BreedDetailPage = () => {
  const router = useRouter();
  const breedName = router.query.breedName as string;

  useEffect(() => {
    router.prefetch("/breeds");
  }, [router]);

  return (
    <>
      <Head >
        <title>{breedName ? breedName.charAt(0).toUpperCase() + breedName.slice(1).replace(/-/g, " ") + ' | Doghouse' : ''}</title>
      </Head>
      <Box as="section" h="100vh" >
        <Container
          pt={{
            base: "4",
            lg: "8",
          }}

        >
          {breedName && (
            <BreedDetails
              breedName={breedName}
            />
          )}
        </Container>
        <Footer />
      </Box>
    </>

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
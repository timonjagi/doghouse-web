import React from "react";
import { CtaCentredOnAccent } from "./CtaCentredOnAccent";

type CompleteProfileCTAProps = {};

const EthicalQuestionairreCard: React.FC<CompleteProfileCTAProps> = () => {
  return (
    <CtaCentredOnAccent
      title="Is Your Home Pet-Ready?"
      description="Take our quick  questionnaire to see if you're prepared for the joy, commitment, and love that adopting a furry friend brings."
      ctaText1="Learn more"
      ctaLink1="#"
      ctaText2="Find Out Now"
      ctaLink2="#"
    />
  );
};
export default EthicalQuestionairreCard;

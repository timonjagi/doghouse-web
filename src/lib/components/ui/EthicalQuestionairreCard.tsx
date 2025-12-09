import React from "react";
import { CtaCentredOnAccent } from "./CtaCentredOnAccent";

type CompleteProfileCTAProps = {};

const EthicalQuestionairreCard: React.FC<CompleteProfileCTAProps> = () => {
  return (
    <CtaCentredOnAccent
      title="Is Your Home Pet-Ready?"
      description="Take our quick  questionnaire to ensure you're prepared for the joy, love, and commitment that adopting a furry friend brings."
      ctaText1="Learn more"
      ctaLink1="#"
      ctaText2="Take the Quiz"
      ctaLink2="#"
    />
  );
};
export default EthicalQuestionairreCard;

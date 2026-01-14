import React from "react";
import { CtaCentred } from "./CtaCentred";
import { CtaCentredOnAccent } from "./CtaCentredOnAccent";

type EthicalQuestionairreCardProps = {
  colorScheme?: string;
};

const EthicalQuestionairreCard: React.FC<EthicalQuestionairreCardProps> = ({ colorScheme = "surface" }) => {
  if (colorScheme === "on-accent") {
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
  }
  return (
    <CtaCentred
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

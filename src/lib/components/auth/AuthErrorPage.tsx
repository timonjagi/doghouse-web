import React from "react";

type AuthErrorPageProps = {
  error: any;
};

const AuthErrorPage: React.FC<AuthErrorPageProps> = ({ error }) => {
  return <div>{error?.message}</div>;
};
export default AuthErrorPage;

import type { User } from "firebase/auth";
import type React from "react";

type ClientDashboardProps = {
  user: User;
};
// eslint-disable-next-line
const ClientDashboard: React.FC<ClientDashboardProps> = ({ user }) => {
  return <div>Have a good coding</div>;
};
export default ClientDashboard;

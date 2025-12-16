import { NovuProvider } from "@novu/react";
import { useSupabaseAuth } from "lib/hooks/useSupabaseAuth";
import { NotificationPopupProvider } from "./NotificationPopupProvider";

interface NovuWrapperProps {
  children: React.ReactNode;
}

const NovuWrapper: React.FC<NovuWrapperProps> = ({ children }) => {
  const { user } = useSupabaseAuth();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <NovuProvider
      subscriberId={user.id}
      applicationIdentifier={process.env.NOVU_APPLICATION_IDENTIFIER!}
    >
      <NotificationPopupProvider>
        {children}
      </NotificationPopupProvider>
    </NovuProvider>
  );
};

export default NovuWrapper;
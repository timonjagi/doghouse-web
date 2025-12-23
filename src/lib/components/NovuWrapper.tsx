import { useEffect, useRef } from "react";
import { NovuProvider } from "@novu/react";
import OneSignal from "react-onesignal";
import { useSupabaseAuth } from "lib/hooks/useSupabaseAuth";
import { NotificationPopupProvider } from "./NotificationPopupProvider";

interface NovuWrapperProps {
  children: React.ReactNode;
}

const NovuWrapper: React.FC<NovuWrapperProps> = ({ children }) => {
  const { user, loading } = useSupabaseAuth();
  const oneSignalInitialized = useRef(false);


  useEffect(() => {
    if (typeof window === "undefined" || oneSignalInitialized.current) {
      return;
    }

    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
    if (!appId) {
      console.warn("OneSignal App ID not configured");
      return;
    }

    OneSignal.init({
      appId,
      allowLocalhostAsSecureOrigin: process.env.NODE_ENV === "development",
    })
      .then(() => {
        oneSignalInitialized.current = true;
        console.log("OneSignal initialized");
      })
      .catch((error) => {
        console.error("OneSignal initialization error:", error);
      });
  }, []);

  useEffect(() => {
    if (!user || typeof window === "undefined") {
      return;
    }

    const syncOneSignalWithNovu = async () => {
      try {
        // Set external user ID in OneSignal
        await OneSignal.login(user.id);

        // Get the OneSignal player ID (subscription ID)
        const playerId = await OneSignal.User.PushSubscription.id;

        if (playerId) {
          // Sync with Novu
          const response = await fetch("/api/novu/update-credentials", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              subscriberId: user.id,
              deviceToken: playerId,
            }),
          });

          if (!response.ok) {
            console.error("Failed to sync OneSignal with Novu");
          } else {
            console.log("OneSignal synced with Novu");
          }
        }
      } catch (error) {
        console.error("Error syncing OneSignal with Novu:", error);
      }
    };

    // Wait for OneSignal to be ready
    if (oneSignalInitialized.current) {
      syncOneSignalWithNovu();
    } else {
      // Poll until OneSignal is initialized
      const interval = setInterval(() => {
        if (oneSignalInitialized.current) {
          clearInterval(interval);
          syncOneSignalWithNovu();
        }
      }, 500);

      return () => clearInterval(interval);
    }
  }, [user]);

  if (loading) {
    return null;
  }

  if (!user) {
    return <>{children}</>;
  }

  return (
    <NovuProvider
      subscriberId={user.id}
      applicationIdentifier={process.env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER!}
    >
      <NotificationPopupProvider>{children}</NotificationPopupProvider>
    </NovuProvider>
  );
};

export default NovuWrapper;
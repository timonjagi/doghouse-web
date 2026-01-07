import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useBreakpointValue, Box } from "@chakra-ui/react";
import InboxPage from "../../../lib/components/pages/inbox/InboxPage";
import ConversationView from "../../../lib/components/pages/inbox/ConversationView";

const ConversationPage = () => {
  const router = useRouter();
  const { conversationId } = router.query;
  const [selectedId, setSelectedId] = useState<string | undefined>();

  // Check if we're on mobile (base breakpoint)
  const isMobile = useBreakpointValue({ base: true, lg: false });

  useEffect(() => {
    if (conversationId && typeof conversationId === "string") {
      setSelectedId(conversationId);
    }
  }, [conversationId]);

  // If no conversationId in URL, redirect to main inbox
  if (!conversationId) {
    return <InboxPage />;
  }

  // On mobile, show conversation directly
  if (isMobile && selectedId) {
    return <ConversationView conversationId={selectedId} />;
  }

  // On desktop, show the full inbox with the conversation pre-selected
  return <InboxPage defaultSelectedConversationId={selectedId} />;
};

export default ConversationPage;

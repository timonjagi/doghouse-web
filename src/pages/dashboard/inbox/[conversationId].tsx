import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import InboxPage from '../../../lib/components/pages/inbox/InboxPage';

const ConversationPage = () => {
  const router = useRouter();
  const { conversationId } = router.query;
  const [selectedId, setSelectedId] = useState<string | undefined>();

  useEffect(() => {
    if (conversationId && typeof conversationId === 'string') {
      setSelectedId(conversationId);
    }
  }, [conversationId]);

  // If no conversationId in URL, redirect to main inbox
  if (!conversationId) {
    return <InboxPage />;
  }

  // Show the full inbox with the conversation pre-selected
  return <InboxPage defaultSelectedConversationId={selectedId} />;
};

export default ConversationPage;

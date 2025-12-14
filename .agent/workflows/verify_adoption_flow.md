---
description: Verify the Refactored Pet Adoption Flow
---

1.  **Navigate to a Listing Page**:
    *   Go to a listing that is "Available".
    *   Verify the button says "Message Seller" (was "Apply Now").
    *   Click "Message Seller". Verify the `AdoptionForm` opens.
    *   Fill out the form and submit. Verify it redirects to the Inbox.

2.  **Verify Inbox - Adoption Conversation**:
    *   In the Inbox, check the "Adoptions" tab.
    *   Open the new conversation.
    *   Verify the **Banner** appears at the top with "Adoption Submitted" state.
    *   Verify the contextual info (Pet details, Progress bar) is visible.

3.  **Navigate to a Sold-Out Listing**:
    *   Go to a listing that is "Sold" or "Sold Out".
    *   Verify the button says "Message Seller".
    *   Click it. Verify the `AdoptionForm` opens (or the simplified Inquiry version).
    *   Submit a message.
    *   Verify it redirects to the Inbox (Enquiries tab likely, or All).

4.  **Verify Inbox - Tabs & Search**:
    *   Test "All", "Adoptions", "Enquiries", "Support" tabs.
    *   Type in the Header Search bar. Verify the list filters in real-time without determining the page.

5.  **Verify Adoption Actions**:
    *   As a Breeder (if possible to simulate), view an adoption conversation.
    *   Verify "Approve" / "Reject" buttons appear in the Banner.
    *   Click "Approve". Verify status updates (Banner changes to "Approved").
    *   As a Seeker, verify Banner updates to "Pay Reservation".

6.  **Verify Stateless Timeline**:
    *   The `AdoptionTimeline` logic is now driving the banner. Ensure no regressions in the older Timeline view if used elsewhere (e.g. `AdoptionDetailPage` if it exists).

7.  **Check Mobile vs Desktop**:
    *   Verify Inbox layout on mobile (Full screen list -> Full screen chat).
    *   Verify Inbox layout on desktop (Sidebar list -> Main chat).

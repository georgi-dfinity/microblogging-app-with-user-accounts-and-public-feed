# Specification

## Summary
**Goal:** Show each post’s author username in the public feed instead of always displaying “Anonymous”.

**Planned changes:**
- Backend: Resolve each post author principal to a stored user profile and expose username lookup in a way that public/guest feed views can access without admin privileges.
- Frontend: Update post card rendering to display the resolved author username, falling back to “Anonymous” only when no profile/username exists for that principal.
- Frontend: Ensure the public feed data-fetching path includes the needed author-to-username resolution without introducing authorization errors for non-admin/guest viewers.

**User-visible outcome:** Posts in the public feed show the authenticated author’s username when available; “Anonymous” appears only for authors without a saved user profile, and the feed works for guests/non-admins without auth errors.

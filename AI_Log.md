

Yaphet AI Log
Prompt:
As a frontend partner on the project, I used the AI to help understand how our existing React components — particularly the Home page (Hike Grid), Hike Detail view, and shared UI elements like HikeCard and CommentCard — would need to change once we transitioned from dummy-data to live backend endpoints. I asked specifically about how to structure fetch calls, handle authentication cookies, and map backend JSON into the component props the UI already expected.
Issues:
Some of the AI’s initial answers oversimplified the integration. It assumed we would continue doing all filtering on the client, even though part of that logic was being moved server-side. It also relied on field names and dummy-data patterns that no longer existed, such as resolving users inside CommentCard from a local array. Finally, several examples omitted credentials: 'include', which is required for our backend’s JWT cookie system and would have caused review submission and upvotes to fail.
Fix:
Working with my frontend teammate, I used the AI’s suggestions as a reference and adapted them to fit our actual codebase. I helped adjust the Home page so hikes would load from the backend instead of static arrays, added the necessary loading/error states, and made sure authentication-sensitive requests included cookie credentials. For the Hike Detail page, I refined the AI’s approach to match our two-endpoint structure (one for hike details, one for reviews) and updated component props so CommentCard would rely on backend-provided user info instead of dummy-data. This allowed our existing UI to remain intact while preparing it for real data.
Explanation:
My role wasn’t to implement the full feature alone, but to support the main frontend developer by refining the AI’s output and making sure our integration steps aligned with the backend contract and the UI’s expected data shapes. The AI served as a helpful guide, and I contributed corrections that ensured the frontend transition from mock data to backend-driven data would be reliable and consistent with the rest of the team’s work.

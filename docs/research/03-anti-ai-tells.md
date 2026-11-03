# Anti-AI Tells - 60 Issues in dashboard/page.tsx

## Content Tells (1-15)
1. Generic "Lady Eleanor Vance" name - too stereotypical AI name
2. "Royal Gold VIP" badge - overused AI phrasing
3. "Haute Reward Points" - trying too hard to be fancy
4. "Member ID: #ED-VIP-2026" - formulaic
5. "Paris, France" hardcoded generically
6. Tab labels: "Active Reservations", "Pre-Order History", "Favorite Dishes" - safe but bland
7. "Modify Booking" button text - generic
8. "Order Again →" - common AI pattern
9. Hardcoded fake data everywhere
10. "Track in VIP Dashboard" - circular
11. Overuse of emojis in UI (🛍️, 🚗) - unpolished
12. "Luxury Pickup", "White-Glove Delivery" - marketing speak
13. "Gourmet Takeout & Pre-Orders" - buzzwordy
14. "Master chefs" - cliché
15. "Real-time tracking link have been sent" - grammar error in checkout success

## Design/Code Tells (16-30)
16. Everything centered with max-width containers
17. Gradient buttons everywhere
18. Excessive use of rounded corners (rounded-2xl, rounded-xl)
19. Card pattern repeated identically
20. Badge system overused
21. Shadow effects heavy
22. Border colors all similar
23. Grid layouts predictable
24. Icon usage minimal/generic
25. Framer Motion used but animations generic
26. Hardcoded Unsplash images
27. Color scheme too safe (amber on zinc)
28. Too many sections with same structure
29. "Coming soon" energy
30. Lack of unique brand elements

## UX Tells (31-45)
31. No real authentication
32. Fake profile data
33. Can't actually modify booking
34. Dashboard shows fake data for non-logged-in user
35. No empty states done well
36. "Browse Menu Again" after success - odd flow
37. Tab switching instant, no animation
38. All data hardcoded
39. No loading states
40. No error states
41. Form validation basic
42. Success message generic
43. No order status tracking
44. Favorites can't actually be favorited
45. No personalization

## Technical/AI Smells (46-60)
46. Comments like "// Simulated database" in API routes
47. Placeholder data everywhere
48. "You could set an error state" comment in checkout
49. setTimeout for simulation
50. Overuse of "luxury", "haute", "royal" adjectives
51. Inconsistent naming
52. Copy reads like marketing brochure
53. Generic hero sections
54. Stock photo URLs obvious
55. No real business logic
56. RAG is keyword matching (embarrassingly fake)
57. No transactions
58. CORS wide open (reckless)
59. Everything client-side state
60. Lacks soul/unique voice

## Fix Strategy
- Replace with more authentic, specific copy
- Add real auth flow
- Remove emojis or use sparingly
- Make it feel more editorial/restraint
- Add unique details
- Fix grammar
- Real functionality over simulation
- More human tone

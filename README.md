# Project in React and Next.js

# Overview
This is a practice project to maintain a record of my positional trades in Indian Equity Markets. 

# Implementation Details
- I have used next.js(API) and react(UI) to implement this project. This is a side project and keep on updating the project bi-weekly to add more cool functionality. 
- On Load, the app make an API call to backend to fetch current market price of all holdings and calculate backend-specific analytics. To get live data, I have written a custom scraper. I plan to replace it with a free API discovered recently.
- The data fetched is processed to calculate client-side analytics.
- Finally, the data is rendered. For this I have used a library called Chakra-UI to get a smooth styling :)

# What's next:
1. User can add/edit their holding directly from the UI.
2. Build cool charts to analyse holdings based on parameters like amount inveted, return on investment and relative return on portfolio.
3. I plan to bring a smart compound interest calculator as well to help forecast future returns for my fellow investors.
4. Let us see if we can pull off an LLM which can suggest the position sizing based on differnet parameters we hold. Again, it is a long shot. LOL.

![Bull & Bear](https://g.foolcdn.com/editorial/images/765862/bull-and-bear-1.jpg)

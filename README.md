# Guardian of Makers
## 1. Brief
[Hero Gif]
- Guardian of Makers (GoM) is a **Safe AI Guidance for young makers to learn to fail and experiment more.**
- Multi-modal AI running on WebApp, powered by Google Gemini
- Keywords: Multi-modal AI, Failing Forward, Safety, Tele-supervision, Affective AI

### Why Maker Ed matters?

_‘Maker education is more than just making – it’s learning trial and failure, just like real world.’_
Richard Brown,
Imperial Making Lab, Apr 2024
- **Maker Ed is the best method for STEM education**: Hands-on science projects provided a deeper understanding of concepts than traditional methods such as lectures, and tests (Riskowski et al., 2009)
- **Students learn more deeply when they can apply classroom-gathered knowledge to real-world problems.** Asking questons helps students transfer their learning to new kinds of situations, including ones outside of the classroom (Barron & Darling-Hammond, 2008)
- "**Fostering the maker mindset through education is a fundamentally human project** -- to support the growth and development of another person not just physically, but mentally and emotionally" (Dougherty, 2013)

## 2. Features
[Features Image (Bento)]
- Safety intervention: Notifies student about potential danger based on vision input  
_"Soldering iron is just lying on the desk. You should turn it off while you're not using it"_
- Project recommendation: Recommends potential project that's available or suitable for student based on components they have and their previous projects.
_"What interesting project can I undertake with the components I have?"_
- Components information and wiring: Explains the function of the component and how to wire it according to the component documentation, based on vision.
_"How should I wire this compoenent with my arduino?"_

## 3. Responsible AI: Is the project responsible with AI?
### Human supervision of AI
- We all know that AI isn’t flawless. And as kids are directly communicating with Ai. It is important to set AI agent as teaching assistants and have it under influence of human supervisor.
### Maker Ed and Inclusion
- Maker Education is vital for inclusion in the field of STEM. Researches show that maker education grows the interest in computer science and engineering for under represented people in STEM such as women.
### Affective AI
- In maker ed, ‘safe’ also includes emotional and mental aspect. It’s been always important to encourage student’s confidence. Through asking and answering questions, students learn to express their project and have confidence whether they fail or not.
### Education for all
- The app is web-based, so that every students around the world can access the app. 

## 5. Spiecemen and Setup
### Spicemen
- Google Gemini API
- React.js
- TTS / STT API
### Setup
1. install node.js and npm
2. `git clone https://github.com/SBleeyouk/guardian-of-makers.git <folder directory here>`
3. Create .env file, fill in the Google Studio Gemini API key
`API_KEY = <Your Google API KEY>`
4. on vs code terminal:
`yarn install`
`npm run start`

## 5. Future Works: What's Next?
1. Keep on revising the prompt with Maker Ed professionals to improve prompt 
2. Deliver features
3. 

## References
1. Riskowski et al., 2009
2. Barron & Darling-Hammond, 2008
3. Dougherty, 2013
4. Google Gemini API Document
5. 
## Memo / Trial & Error
- 
---
The project was submitted to Google AI Hackathon 2024. [View the project]() 

Saetbyeol Leeyouk (Sogang University) led AI and web development.
Chanwoo Lee (Imperial College London) led Human-AI Interaction design. 

Thanks to Richard Brown and 000 from Imperial Makerspace Technician at Imperial College London for sharing their insight throughout the project.

# Mobile app to record and transcribe audio then auto categorize

## Tech stack

- [Expo](https://expo.dev/) for the frontend
  - [Expo router](https://docs.expo.dev/router/introduction/)
  - [React native paper](https://reactnativepaper.com/) for material design components
- [Convex](https://www.convex.dev/) for the backend
- [OpenAI](https://platform.openai.com/docs/overview) for transcription and categorization

## Getting started

### Install all the stuff

`npm i`

### Setup you Convex server

This is a terminal blocking command

`npx convex dev`

### Run the frontend app via Expo

In a different terminal

`npm run start`

## Questions?

Chat with @Indy at [Convex discord community](https://convex.dev/community)

## Ideas on what's next

- [ ] Significantly improve UI
  - [ ] Switch from React Native Paper to Tamagui?
- [ ] Make multiple offline recordings to be uploaded when back online
- [ ] Make this truly cross platform with React Native / Expo Web
- [ ] Package a real Android app to use properly
- [ ] Package a real iOS app to use properly
- [ ] AI to make suggestions to journal entry for publishing as blog post

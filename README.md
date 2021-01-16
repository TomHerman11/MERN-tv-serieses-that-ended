# MERN-tv-shows-that-ended
A Full-Stack App (React, MongoDb, Node.js, Apollo GraphQL, Typescript) that supports CRUD operations for TV Shows. 📺🎬⭐

Now you will know which TV shows you can watch without having to wait anxiously for the next season to come out! 😉

The goal of this project was to learn MongoDb and Apollo GraphQL, and to create an end-to-end flow of a full stack app.

Client & Server are written in TypeScript 🚀
<br>
<br>

![Demo of 'MERN-tv-shows-that-ended' Project](/MERN-Best-TV-Shows-that-Ended.gif)

## Super Meaningful and Important Code:
### Server
- [server/src/index.ts](server/src/index.ts):
    - Create an Express.js server with Apollo GraphQL endpoint
    - Connect to a local MongoDB db & Collection.
- [server/src/graphql/schema.ts](server/src/graphql/schema.ts):
    - Define 'typeDefs' and 'resolvers' for an `ApolloServer`.

### Client:
- The initial code was created with ```npx create-react-app client --template typescript```.
- [client/src/App.tsx](client/src/App.tsx):
    - Connect to the `ApolloServer` with an `ApolloClient`.
    - Using `ApolloProvider` as react's `Context.Provider`.
    - Setting the different Routes with `react-router`.
- [client/src/Pages/TvSeriesesPage/TvSeriesesPage.tsx](client/src/Pages/TvSeriesesPage/TvSeriesesPage.tsx):
    - Example of using Apollo's Query.
- [client/src/Pages/AddTvSeriesPage/AddTvSeriesPage.tsx](client/src/Pages/AddTvSeriesPage/AddTvSeriesPage.tsx):
    - Example of using Apollo's Mutation & Update manually Apollo's Query cache (this will updated the client's cache, no need to refresh and pull from the server the new data).

## How to Start the Server
1. Make a mongoDB **db** with the name *'tv-shows-that-ended'* and **collection** *'shows'*.
2. Terminal: ```cd server; npm install```.
3. Run options:
    - Via terminal:
        - Terminal1: ```npm run watch-ts```
        - Terminal2: ```npm run watch-node```
    - Via VSCode:
        - Task: Run task 'server-watch'
        - OR
        - Debugger: 'Launch Server'

## How to Start the Client
1. Terminal: ```cd client; npm install```.
2. Run options:
    - Via terminal: ```npm start```
    - Via VSCode:
        - Task: Run task 'client-watch'

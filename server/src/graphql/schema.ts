import { Collection } from 'mongodb';
import _ from 'lodash';

interface TvSeries {
    title: string,
    yearBegin: number,
    yearEnd: number,
    popularity: number
}

const { gql } = require('apollo-server-express');
export const typeDefs = gql`
      type Series {
        _id: ID!
        title: String!
        yearBegin: Int!
        yearEnd: Int!
        popularity: Int!
      }

      type Query {
        serieses: [Series]
        series(title: String!): Series
      }

      type Mutation {
        addSeries(title: String!, yearBegin: Int!, yearEnd: Int!, popularity: Int!): Series
      }
    `;

export const resolversWithMongoDb = (seriesesDb: Collection<any>) => {
    return {
        Query: {
            serieses: async () => {
                return await seriesesDb.find().toArray();
            },
            series: async (root: any, { title }: { title: string }) => {
                return await seriesesDb.findOne({ title });
            },
        },
        Mutation: {
            addSeries: async (root: any, { title, yearBegin, yearEnd, popularity }: TvSeries) => {
                return await seriesesDb.insertOne({ title, yearBegin, yearEnd, popularity });
            }
        }
    }
}

import { Collection } from 'mongodb';
import _ from 'lodash';

interface Series {
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
                const res = (await seriesesDb.find({ title }).toArray());
                return !_.isEmpty(res) ? res[0] : null;
            },
        },
        Mutation: {
            addSeries: async (root: any, { title, yearBegin, yearEnd, popularity }: Series) => {
                return await seriesesDb.insertOne({ title, yearBegin, yearEnd, popularity });
            }
        }
    }
}

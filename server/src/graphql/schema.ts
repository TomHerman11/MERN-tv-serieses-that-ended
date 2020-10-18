import { Collection } from 'mongodb';
import _ from 'lodash';

interface TvSeriesParameters {
    title: string,
    yearBegin: number,
    yearEnd: number,
    popularity: number
}

interface MongoTvSeries extends TvSeriesParameters {
    _id: number
}

interface TvSeries extends TvSeriesParameters {
    id: number
}


const { gql } = require('apollo-server-express');
export const typeDefs = gql`
      type Series {
        id: ID!
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

function constructTvSeriesObject(mongoDbSeriesResult: MongoTvSeries): TvSeries {
    return {
        id: parseInt(mongoDbSeriesResult._id.toString()),
        title: mongoDbSeriesResult.title,
        yearBegin: mongoDbSeriesResult.yearBegin,
        yearEnd: mongoDbSeriesResult.yearEnd,
        popularity: mongoDbSeriesResult.popularity
    };
}

export const resolversWithMongoDb = (seriesesDb: Collection<any>) => {
    return {
        Query: {
            serieses: async (): Promise<TvSeries[]> => {
                return await (await seriesesDb.find().toArray()).map(series => {
                    return constructTvSeriesObject(series);
                });
            },
            series: async (root: any, { title }: { title: string }): Promise<TvSeries> => {
                return constructTvSeriesObject(await seriesesDb.findOne({ title }));
            },
        },
        Mutation: {
            addSeries: async (root: any, { title, yearBegin, yearEnd, popularity }: TvSeriesParameters): Promise<TvSeries> => {
                const response = await seriesesDb.insertOne({ title, yearBegin, yearEnd, popularity });
                return constructTvSeriesObject(response.ops[0]);
            }
        }
    }
}

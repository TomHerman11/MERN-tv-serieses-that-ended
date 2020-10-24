import { Collection } from 'mongodb';
import _ from 'lodash';

interface TvSeriesParameters {
    title: string,
    yearBegin: number,
    yearEnd: number,
    popularity: number
}

interface MongoTvSeries extends TvSeriesParameters {
    _id: string
}

interface TvSeries extends TvSeriesParameters {
    id: string
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

// deleteSeries(title: String!): Series

function constructTvSeriesObject(mongoDbSeriesResult: MongoTvSeries): TvSeries {
    return {
        id: mongoDbSeriesResult._id.toLocaleString(),
        title: mongoDbSeriesResult.title,
        yearBegin: mongoDbSeriesResult.yearBegin,
        yearEnd: mongoDbSeriesResult.yearEnd,
        popularity: mongoDbSeriesResult.popularity
    };
}

// Higher popularity comes first, then title
function compareTvSerieses(series1: TvSeries, series2: TvSeries): number {
    if (series2.popularity !== series1.popularity) {
        return series2.popularity - series1.popularity;
    }
    if (series1.title < series2.title) return -1;
    if (series1.title > series2.title) return 1;
    return 0;
}

export const resolversWithMongoDb = (seriesesDb: Collection<any>) => {
    return {
        Query: {
            serieses: async (): Promise<TvSeries[]> => {
                return (await seriesesDb.find().toArray()).map(series => {
                    return constructTvSeriesObject(series);
                }).sort(compareTvSerieses);
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

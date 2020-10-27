import { Collection, ObjectId } from 'mongodb';
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
        updateSeries(id: ID!, title: String!, yearBegin: Int!, yearEnd: Int!, popularity: Int!): Series
        deleteSeries(id: ID!): String
      }
    `;

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
            },

            updateSeries: async (root: any, { id, title, yearBegin, yearEnd, popularity }: TvSeries): Promise<TvSeries> => {
                const updateRes = await seriesesDb.findOneAndUpdate(
                    { _id: new ObjectId(id) },
                    {
                        $set:
                        {
                            title: title,
                            yearBegin: yearBegin,
                            yearEnd: yearEnd,
                            popularity: popularity
                        }
                    }
                );
                // if 'find' failed, 'updateRes.value' is 'null':
                if (!updateRes.value) {
                    return { id: "", title, yearBegin, yearEnd, popularity };
                }
                return { id, title, yearBegin, yearEnd, popularity };
            },

            deleteSeries: async (root: any, { id }: { id: string }): Promise<String> => {
                const removeRes = await seriesesDb.findOneAndDelete({ "_id": new ObjectId(id) });

                // If the tvSeries was removed, we return the id of the removed item:
                if (removeRes?.value) {
                    return id;
                }

                // If could not remove the item, return "empty" id:
                return "";
            }
        }
    }
}

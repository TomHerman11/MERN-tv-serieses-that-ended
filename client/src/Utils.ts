import { gql } from '@apollo/client';

export interface TvSeriesInterface {
    id: string,
    title: string,
    yearBegin: number,
    yearEnd: number,
    popularity: number
}

export const TV_SERIESES_QUERY = gql`
query GetTvSerieses {
    serieses {
        id
        title
        yearBegin
        yearEnd
        popularity
    }
  }
`;

export const routerRoutes = {
    home: '/',
    addTvSeries: '/add-tv-series'
};
import { gql } from '@apollo/client';

export interface TvSeriesInterface {
    id: string,
    title: string,
    yearBegin: number,
    yearEnd: number,
    popularity: number
}

export const QUERY_TV_SERIESES = gql`
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

export const QUERY_TV_SERIES = gql`
query GetTvSeries($title: String!) {
    series(title: $title) {
        id
        title
        yearBegin
        yearEnd
        popularity
    }
}
`;

export const MUTATION_ADD_TV_SERIES = gql`
mutation AddTvSeries($title: String!, $yearBegin: Int!, $yearEnd: Int!, $popularity: Int!) {
    addSeries(title: $title, yearBegin: $yearBegin, yearEnd: $yearEnd, popularity: $popularity) {
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
    addTvSeries: '/add-tv-series',
    tvSeries: '/tv-series'
};

export function capitalizeFirstLetter(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export function capitalizeFirstLetters(s: string | undefined): string | undefined {
    if (!s) return;
    const words = s.split(/[ ,]+/);
    return words.map(word => capitalizeFirstLetter(word)).join(' ');
}
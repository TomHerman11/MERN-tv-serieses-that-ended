import _ from 'lodash';
import { gql } from '@apollo/client';

export interface TvSeriesPropsInterface {
    title: string,
    yearBegin: number,
    yearEnd: number,
    popularity: number
}

export interface TvSeriesInterface extends TvSeriesPropsInterface {
    id: string
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

export const MUTATION_UPDATE_TV_SERIES = gql`
mutation UpdateTvSeries($id: ID!, $title: String!, $yearBegin: Int!, $yearEnd: Int!, $popularity: Int!) {
    updateSeries(id: $id, title: $title, yearBegin: $yearBegin, yearEnd: $yearEnd, popularity: $popularity) {
        id
        title
        yearBegin
        yearEnd
        popularity
    }
}
`;

export const MUTATION_DELETE_TV_SERIES = gql`
mutation DeleteTvSeries($id: ID!) {
    deleteSeries(id: $id)
}
`;

export const routerRoutes = {
    home: '/',
    addTvSeries: '/add-tv-series',
    tvSeries: '/tv-series',
};

export function capitalizeFirstLetter(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export function capitalizeFirstLetters(s: string | undefined): string | undefined {
    if (!s) return;
    const words = s.split(' ');
    return words.map(word => capitalizeFirstLetter(word)).join(' ');
}

export function insertIntoSortedTvSerieses(serieses: TvSeriesInterface[], newSeries: TvSeriesInterface): TvSeriesInterface[] {
    if (_.isEmpty(serieses)) return [newSeries];

    // find the index to insert the new series:
    let index = 0;
    for (index = 0; index < serieses.length; index++) {
        if (newSeries.popularity > serieses[index].popularity) break;
        else if (
            newSeries.popularity === serieses[index].popularity &&
            newSeries.title < serieses[index].title
        ) break;
    }
    return [...serieses.slice(0, index), newSeries, ...serieses.slice(index, serieses.length)];
};

export function updateSeriesInArray(serieses: TvSeriesInterface[], updatedSeries: TvSeriesInterface): TvSeriesInterface[] {
    let newArr: TvSeriesInterface[] = []
    // remove the updated series from the array first:
    for (let index = 0; index < serieses.length; index++) {
        if (updatedSeries.id === serieses[index].id) {
            newArr = [...serieses.slice(0, index), ...serieses.slice(index + 1, serieses.length)];
        }
    }

    // insert the updated series in its new index:
    let index = 0;
    for (; index < newArr.length; index++) {
        if ((updatedSeries.popularity > newArr[index].popularity) ||
            (updatedSeries.popularity === newArr[index].popularity &&
                updatedSeries.title < newArr[index].title)) {
            break;
        }
    }
    return [...newArr.slice(0, index), updatedSeries, ...newArr.slice(index, serieses.length)]
}

export function deleteSeriesFromArray(serieses: TvSeriesInterface[], deletedSeries: string): TvSeriesInterface[] {
    // find the index to remove:
    for (let index = 0; index < serieses.length; index++) {
        if (deletedSeries === serieses[index].id) {
            return [...serieses.slice(0, index), ...serieses.slice(index + 1, serieses.length)];
        }
    }
    return serieses;
};
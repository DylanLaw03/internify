// Company Interface, and related interface

// enum for seasons
export enum Season {
    Spring = 1,
    Summer = 2,
    Fall = 3,
    Winter = 4
}

export interface Offer {
    offerID: number;
    pay: number;
    bonus: number;
    otherComp: string;
}

export interface Interview {
    interviewID: number;
    numberRounds: number;
    interviewType: string[];
    offer: boolean;
    offerInfo?: Offer;
}

export interface Position {
    positionID: number;
    year: number;
    term: Season;
    positionType: string;
    interviews: Interview[];
}

export interface Company {
    companyID: number,
    headquarterLocation: string;
    currentPositions: Position[],
    pastPositions: Position[]
}
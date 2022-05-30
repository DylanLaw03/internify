// Company Interface, and related interface

import { ObjectId } from "mongoose";

// enum for seasons
export enum Season {
    Spring = 1,
    Summer = 2,
    Fall = 3,
    Winter = 4
}

export interface IOffer {
    pay: number;
    bonus: number;
    otherComp: string;
}

export interface IInterview {
    companyName: string,
    position: ObjectId,
    numberRounds: number;
    interviewType: string[];
    offer: boolean;
    offerInfo?: IOffer;
}

export interface IPosition {
    year: number;
    term: Season;
    positionType: string;
    interviews?: IInterview[];
}

export interface ICompany {
    companyName: string;
    headquarterLocation: string;
    currentPositions?: IPosition[],
    pastPositions?: IPosition[]
}


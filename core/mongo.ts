import mongoose from "mongoose";
const { Schema } = mongoose;
import {IPosition, IInterview, ICompany} from './company';


// define mongo schemas
export const companySchema = new Schema<ICompany>({
    companyName: {type: String, required: true, unique: true, dropDups: true},
    headquarterLocation: {type: String, required: true},
}, { collection: "companies"});
  
export const positionSchema = new Schema<IPosition>({
    companyID: {type: Schema.Types.ObjectId, required: true},
    year: Number,
    term: Number,
    positionType: String,
    currentlyOpen: Boolean
}, {collection: "positions"});

export const interviewSchema = new Schema<IInterview>({
    positionID: {type: Schema.Types.ObjectId, required: true},
    numberRounds: Number,
    interviewType: [String],
    offer: {
      pay: Number,
      bonus: Number,
      otherComp: String
    }  
}, {collection: "interviews"});


  
// mongo models
export const companyModel = mongoose.model<ICompany>("Company", companySchema);
export const interviewModel = mongoose.model<IInterview>("Interview", interviewSchema);
export const positionModel = mongoose.model<IPosition>("Position", positionSchema);
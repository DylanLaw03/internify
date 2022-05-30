import express, {Request, Response} from 'express';
import { IOffer, IPosition, IInterview, ICompany, Season } from './core/company';
import mongoose from 'mongoose';
require("dotenv").config();
const { Schema } = mongoose;

// setup app
const app = express();
app.use(express.json());


const testOffer: IOffer = {
  pay: 45,
  bonus: 10000,
  otherComp: "None"
}

const offerArray: Array<IOffer> = [testOffer];

const testInterview: IInterview = {
  numberRounds: 2,
  interviewType: ["Technical", "Personal"],
  offer: true,
  offerInfo: testOffer
}

const interviewArray: Array<IInterview> = [testInterview];

const testPosition: IPosition = {
  year: 2022,
  term: Season.Summer,
  positionType: "SWE",
  interviews: interviewArray
}

const posArray: Array<IPosition> = [testPosition]



// define mongo schema
const companySchema = new Schema<ICompany>({
  companyName: {type: String, required: true},
  headquarterLocation: {type: String, required: true},
  currentPositions: [
    {year: Number,
    term: Number,
    positionType: String,
    interviews: [{
      numberRounds: Number,
      interviewType: [String],
      offer: Boolean,
      offerInfo: {
        pay: Number,
        bonus: Number,
        otherComp: String,
      }
    }]
  }]
}, { collection: "companies"});


// mongo model
const companyModel = mongoose.model<ICompany>("Company", companySchema);

app.get('/', async (request: Request, response: Response) => {
    const db = await mongoose.connect(process.env.MONGO_URI!);

    const company = new companyModel({
      companyName: "Amazon",
      headquarterLocation: "San Francisco",
      currentPositions: posArray
    });

    await company.save();
    
    response.send(testPosition);
})

// endpoint to add an empty company, interviews and offers inserted at other end points
// requires companyName and headquartersLocation


// listen on assigned port, or port 5000 if local
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
  console.log(`Server running on PORT ${ PORT }`);
})
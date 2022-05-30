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

// connect to mongo db
mongoose.connect(process.env.MONGO_URI!);


// define mongo schema
const companySchema = new Schema<ICompany>({
  companyName: {type: String, required: true, unique: true, dropDups: true},
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
  }],
  pastPositions: [
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

// endpoint to add an empty company, interviews and offers inserted at other end points
// requires companyName and headquarterLocation
app.post('/addCompany', async(req: Request, res: Response) => {
  // validate input params
  if (req.body.companyName === undefined || req.body.headquarterLocation === undefined) {
    console.log("Recieved invalid. Recieved:");
    console.log(req.body);
    return res.status(400).send("Invalid Parameters");
  }
  // create company interface instance
  const newCompanyData: ICompany = {
    companyName: req.body.companyName,
    headquarterLocation: req.body.headquarterLocation,
  }
  
  // create model to be inserted
  const newCompany = new companyModel(newCompanyData);

  // save to db
  try {
    await newCompany.save()
  } 
  catch (err) {
    // catch error
    console.log(err)
    return res.status(400).send("Error adding to Database. Company may already Exist!");
  }

  console.log("Company Added");
  // return 200 if all good
  return res.status(200).send("Company Added");
});

// add position to a company
// params: companyName, year, term(1 = Spring, 2 = summer, 3 = fall, 4 = winter), and position type
app.post('/addPosition', async (req: Request, res: Response) => {
  // validate req body
  if (req.body.companyName === undefined || req.body.year === undefined || req.body.term === undefined || req.body.positionType === undefined) {
    console.log("Recieved invalid. Recieved:");
    console.log(req.body);
    return res.status(400).send("Invalid Parameters");
  }
  console.log(req.body)
  // company to query 
  const company = { "companyName": req.body.companyName };

  // create position interface instance
  const newPositionData: IPosition = {
    year: req.body.year,
    term: req.body.term,
    positionType: req.body.positionType
  }

  let result = await companyModel.findOneAndUpdate(company, {$push: {"currentPositions": newPositionData}});

  // make sure position was added
  if (result === null) {
    console.log("Position Not Added")
    return res.status(406).send("Position Not Added! Company name may be invalid.")
  }
  
  console.log("Position Added")
  return res.status(200).send("Position Added");
})






// listen on assigned port, or port 5000 if local
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
  console.log(`Server running on PORT ${ PORT }`);
})
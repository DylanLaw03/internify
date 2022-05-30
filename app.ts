import express, {Request, Response} from 'express';
import { IOffer, IPosition, IInterview, ICompany, Season } from './core/company';
import mongoose from 'mongoose';
require("dotenv").config();
const { Schema, Types } = mongoose;

// setup app
const app = express();
app.use(express.json());

// connect to mongo db
mongoose.connect(process.env.MONGO_URI!);

// define mongo schemas
const companySchema = new Schema<ICompany>({
  companyName: {type: String, required: true, unique: true, dropDups: true},
  headquarterLocation: {type: String, required: true},
  currentPositions: [
    {year: Number,
    term: Number,
    positionType: String,
  }],
  pastPositions: [
    {year: Number,
    term: Number,
    positionType: String
  }]
}, { collection: "companies"});

const interviewSchema = new Schema<IInterview>({
  companyName: {type: String, required: true},
  position: {type: Schema.Types.ObjectId, required: true},
  numberRounds: Number,
  interviewType: [String],
  offer: Boolean
})


// mongo models
const companyModel = mongoose.model<ICompany>("Company", companySchema);
const inteviewModel = mongoose.model<IInterview>("Interview", interviewSchema);

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
// params: companyName, year, term(1 = Spring, 2 = summer, 3 = fall, 4 = winter), and position type, and current("current", or "past")
app.post('/addPosition', async (req: Request, res: Response) => {

  // validate req body
  if (req.body.companyName === undefined || req.body.year === undefined || req.body.term === undefined || req.body.positionType === undefined) {
    console.log("Recieved invalid. Recieved:");
    console.log(req.body);
    return res.status(400).send("Invalid Parameters");
  }

  // make sure current is correct
  if (req.body.current !== "current" && req.body.current !== "past") {
    console.log("Invalid current param");
    console.log(req.body);
    return res.status(400).send("Invalid parameter value for current.")
  }

  // company to query 
  const company = { "companyName": req.body.companyName };

  // create position interface instance
  const newPositionData: IPosition = {
    year: req.body.year,
    term: req.body.term,
    positionType: req.body.positionType
  }

  // inset into db
  let result;
  
  if (req.body.current === 'current') {
    result = await companyModel.findOneAndUpdate(company, {$push: {"currentPositions": newPositionData}});
  } 
  else if (req.body.current === 'past') {
    result = await companyModel.findOneAndUpdate(company, {$push: {"pastPositions": newPositionData}});
  }

  // make sure position was added
  if (result === null) {
    console.log("Position Not Added")
    return res.status(406).send("Position Not Added! Company name may be invalid.")
  }
  
  console.log("Position Added")
  return res.status(200).send("Position Added");
});

// add interview to a company
// params: companyName, positionId(ObjectID), numberRounds, interviewType[String], offer(Bool)
app.post("/addInterview", async(req: Request, res: Response) => {
  // validate input
  if (req.body.company === undefined || req.body.positionId === undefined || req.body.numberRounds === undefined, req.body.interviewType === undefined || req.body.offer === undefined) {
    console.log("Recieved invalid. Recieved:");
    console.log(req.body);
    return res.status(400).send("Invalid Parameters");
  }

  // new interview
  const newInterviewData: IInterview = {
    companyName: req.body.companyName,
    position: req.body.positionId,
    numberRounds: req.body.numberRounds,
    interviewType: req.body.interviewType,
    offer: req.body.offer
  };

  // create model and save interview
  const newInterview = new inteviewModel(newInterviewData);

  try {
    await newInterview.save();
  }
  catch (error) {
    // catch any errors
    console.log("Error adding Interview");
    console.log(error);
    return res.status(400).send("Error adding Interview");
  }
  // done, send res.
  return res.status(200).send("Interview Successfully Added")
})



// listen on assigned port, or port 5000 if local
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
  console.log(`Server running on PORT ${ PORT }`);
})
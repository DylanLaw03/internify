import express, {Request, Response} from 'express';
import mongoose from 'mongoose';
import { createCompany, addPosition, addInterview, setOffer, updateCompany } from './core/endpoints';
require("dotenv").config();


// setup app
const app = express();
app.use(express.json());

// connect to mongo db
mongoose.connect(process.env.MONGO_URI!);

// endpoint to add an empty company, interviews and offers inserted at other end points
// requires companyName and headquarterLocation
app.post('/addCompany', async(req: Request, res: Response) => {
  return await createCompany(req, res);
});

// add position to a company
// params: companyID (ObjectID), year, term(1 = Spring, 2 = summer, 3 = fall, 4 = winter), and position type, and currentlyOpen(true or false)
app.post('/addPosition', async (req: Request, res: Response) => {
  return await addPosition(req, res);
});

// add interview to a company
// params: companyName, positionID(ObjectID), numberRounds, interviewType[String], offer(Bool)
app.post('/addInterview', async(req: Request, res: Response) => {
  return await addInterview(req, res);
});

// end point to set an offer for an interview
// params: interview(ObjectID), pay, bonus, otherComp
app.post('/setOffer', async(req: Request, res: Response) => {
  return await setOffer(req, res);
});

// end point to update company
// params: required: companyID, optional(must have one): companyName, headquarterLocation
app.post('/updateCompany', async(req: Request, res: Response) => {
  return await updateCompany(req, res);
})



// listen on assigned port, or port 5000 if local
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
  console.log(`Server running on PORT ${ PORT }`);
})
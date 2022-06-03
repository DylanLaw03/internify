import express, {Request, Response} from 'express';
import mongoose from 'mongoose';
const cors = require('cors');
import { createCompany, addPosition, addInterview, setOffer, updateCompany, updatePosition, updateInterview, deleteCompany, deletePosition, deleteInterview, getCompanies, getPositions, getInterviews } from './core/company-endpoints';
require("dotenv").config();


// setup app
const app = express();
app.use(express.json());


//setup cors
const allowedOrigins = ['https://internify-admin-panel.herokuapp.com/', 'https://localhost:3000']
app.use(cors());
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
// params:  positionID(ObjectID), numberRounds, interviewType[String], offer(Bool)
app.post('/addInterview', async(req: Request, res: Response) => {
  return await addInterview(req, res);
});

// end point to set an offer for an interview
// params: interview(ObjectID), pay, bonus, otherComp
app.put('/setOffer', async(req: Request, res: Response) => {
  return await setOffer(req, res);
});

// end point to update company
// params: required: companyID, optional(must have one): companyName, headquarterLocation
app.put('/updateCompany', async(req: Request, res: Response) => {
  return await updateCompany(req, res);
});

// params: requeired: optional(must have one )year, term(1 = Spring, 2 = summer, 3 = fall, 4 = winter), positionType, currentlyOpen(true or false)
app.put('/updatePosition', async (req: Request, res: Response) => {
  return await updatePosition(req, res);
});

// params: requeired: interviewID, optional(min one): numberRounds, interviewType
app.put('/updateInterview', async (req: Request, res: Response) => {
  return await updateInterview(req, res);
});

// params: companyID
app.delete('/deleteCompany', async (req: Request, res: Response) => {
  return await deleteCompany(req, res)
});

// params: poitionID
app.delete('/deletePosition', async (req: Request, res: Response) => {
  return await deletePosition(req, res);
});

// params: interviewID
app.delete('/deleteInterview', async (req: Request, res: Response) => {
  return await deleteInterview(req, res);
});

// gets all companies
app.get('/getCompanies', async(req: Request, res: Response) => {
  return await getCompanies(req, res);
});

// gets positions with specified companyID
app.post('/getPositions', async(req: Request, res: Response) => {
  return await getPositions(req, res);
});

// gets interviews with specified positionID
app.post('/getInterviews', async(req: Request, res: Response) => {
  return await getInterviews(req, res);
})
// listen on assigned port, or port 5000 if local
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
  console.log(`Server running on PORT ${ PORT }`);
})
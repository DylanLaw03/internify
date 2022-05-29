import express, {Request, Response} from 'express';
import { Offer, Position, Interview, Season } from './core/company';

// setup app
const app = express();
app.use(express.json());


const testOffer: Offer = {
  offerID: 10101,
  pay: 45,
  bonus: 10000,
  otherComp: "None"
}

const offerArray: Array<Offer> = [testOffer];

const testInterview: Interview = {
  interviewID: 12,
  numberRounds: 2,
  interviewType: ["Technical", "Personal"],
  offer: true,
  offerInfo: testOffer
}

const interviewArray: Array<Interview> = [testInterview];

const testPosition: Position = {
  positionID: 1,
  year: 2022,
  term: Season.Summer,
  positionType: "SWE",
  interviews: interviewArray
}
app.get('/', (request: Request, response: Response) => {
    response.send(testPosition);
})


// listen on assigned port, or port 5000 if local
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
  console.log(`Server running on PORT ${ PORT }`);
})
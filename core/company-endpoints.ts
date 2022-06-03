import { equal } from 'assert';
import {Request, Response} from 'express';
import { IOffer, IPosition, IInterview, ICompany } from './company';
import { companyModel, companySchema, interviewModel, positionModel } from './mongo';

// endpoint to add an empty company, positions, interviews and offers inserted at other end points
// requires companyName and headquarterLocation
export const createCompany = async (req: Request, res: Response) => {
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
}

// add position to a company
// params: companyID (ObjectID), year, term(1 = Spring, 2 = summer, 3 = fall, 4 = winter), and position type, and currentlyOpen(true or false)
export const addPosition = async (req: Request, res: Response) => {
 // validate req body
    if (req.body.companyID === undefined || req.body.year === undefined || req.body.term === undefined || req.body.positionType === undefined || req.body.currentlyOpen === undefined) {
        console.log("Recieved invali request. Recieved:");
        console.log(req.body);
        return res.status(400).send("Invalid Parameters");
    }

    // first verify that company exists
    let company = await companyModel.findById(req.body.companyID);

    // if company doesn't exist, return error
    if (company === null) {
        console.log("Recieved invalid request. Company does not exist.");
        return res.status(400).send("Company does not exist");
    }
    // create position interface instance
    const newPositionData: IPosition = {
        companyID: req.body.companyID,
        year: req.body.year,
        term: req.body.term,
        positionType: req.body.positionType,
        currentlyOpen: req.body.currentlyOpen
    }

    // create model
    const newPosition = new positionModel(newPositionData);

    // save model
    try {
        newPosition.save();
    }
    catch (error) {
        console.log(error);
        return res.status(400).send("Error adding position");
    }

    console.log("Position Added")
    return res.status(200).send("Position Added");
}

// add interview to a company
// params: companyName, positionID(ObjectID), numberRounds, interviewType[String], offer(Bool)
export const addInterview = async(req: Request, res: Response) => {
    // validate input
    if (req.body.company === undefined || req.body.positionID === undefined || req.body.numberRounds === undefined, req.body.interviewType === undefined || req.body.offer === undefined) {
        console.log("Recieved invalid. Recieved:");
        console.log(req.body);
        return res.status(400).send("Invalid Parameters");
    }

    // first verify that position exists
    let position = await positionModel.findById(req.body.positionID);

    // if position doesn't exist, return error
    if (position === null) {
        console.log("Recieved invalid request. Position does not exist.");
        return res.status(400).send("Position does not exist");
    }

    // new interview
    const newInterviewData: IInterview = {
        positionID: req.body.positionID,
        numberRounds: req.body.numberRounds,
        interviewType: req.body.interviewType,
        offer: req.body.offer
    };

    // create model and save interview
    const newInterview = new interviewModel(newInterviewData);

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
}

// end point to set an offer for an interview
// params: interview(ObjectID), pay, bonus, otherComp
export const setOffer = async(req: Request, res: Response) => {
    // validate request
    if (req.body.interview === undefined || req.body.pay === undefined, req.body.bonus === undefined || req.body.otherComp === undefined) {
        console.log("Recieved invalid request. Recieved:");
        console.log(req.body);
        return res.status(400).send("Invalid Parameters");
    }

    // first verify that position exists
    let interview = await interviewModel.findById(req.body.interviewID);

    // if interview doesn't exist, return error
    if (interview === null) {
        console.log("Recieved invalid request. Interview does not exist.");
        return res.status(400).send("Interview does not exist");
    }
    // create offer interface instance
    const newOfferData: IOffer = {
        pay: req.body.pay,
        bonus: req.body.bonus,
        otherComp: req.body.otherComp
    };
    
    // find interview and add offer
    try {
        await interviewModel.findOneAndUpdate({interview}, {"offer": newOfferData});
    }
    catch (error) {
        // catch any errors
        console.log("Error adding Interview");
        console.log(error);
        return res.status(400).send("Error adding Interview");
    }

    // all set, return status 200
    return res.status(200).send("Offer successfully added");
}

// requires companyID, optional: companyName and headquarterLocation (must have one)
export const updateCompany = async(req: Request, res: Response) => {
    // verify something is being updated
    if (req.body.companyName === undefined && req.body.headquarterLocation === undefined) {
        console.log("Invalid Request. Nothing to update");
        return res.status(400).send("You must enter a value to update")
    }
    // get company
    let company = await companyModel.findById(req.body.companyID);
    
    // verify company exists
    if (company === null) {
        console.log("Cannot update company: Company not found");
        return res.status(400).send("Error: Company not found");
    }

    // now update new values
    if (req.body.companyName !== undefined) {
        company.companyName = req.body.companyName;
    }

    if (req.body.headquarterLocation !== undefined) {
        company.headquarterLocation = req.body.headquarterLocation;
    }

    // save company
    try {
        await company.save();
    }
    catch (error) {
        console.log(error);
        return res.status(400).send("Error saving updated company");
    }

    return res.status(200).send("Company successfully updated")
}

// requires positionID, optional(must have one )year, term(1 = Spring, 2 = summer, 3 = fall, 4 = winter), positionType, currentlyOpen(true or false)
export const updatePosition = async(req: Request, res: Response) => {
    // verify something is being updated
    if (req.body.positionID === undefined && req.body.year === undefined && req.body.term === undefined && req.body.positionType === undefined && req.body.currentlyOpen === undefined) {
        console.log("Invalid Request. Nothing to update");
        return res.status(400).send("You must enter a value to update");
    }

    // get position
    let position = await positionModel.findById(req.body.positionID);

    // if position not found, return that
    if (position === null) {
        console.log("Position not found");
        return res.status(400).send("Error: Position not found")
    }

    // now update new values
    if (req.body.year !== undefined) {
        position.year = req.body.year;
    }

    if (req.body.term !== undefined) {
        position.term = req.body.term;
    }

    if (req.body.positionType !== undefined) {
        position.positionType = req.body.positionType;
    }

    if (req.body.currentlyOpen !== undefined) {
        position.currentlyOpen = req.body.currentlyOpen;
    }


    // save position
    try {
        await position.save();
    }
    catch (error) {
        console.log(error);
        return res.status(400).send("Error saving updated position");
    }

    return res.status(200).send("Position successfully updated")
}


// requires interviewID, optional(must have one )numberRounds, interviewType[String]
export const updateInterview = async(req: Request, res: Response) => {
    // verify something is being updated
    if (req.body.interviewID === undefined && req.body.numberRounds === undefined && req.body.interviewType === undefined) {
        console.log("Invalid Request. Nothing to update");
        return res.status(400).send("You must enter a value to update");
    }

    // get position
    let interview = await interviewModel.findById(req.body.interviewID);

    // if position not found, return that
    if (interview === null) {
        console.log("Interview not found");
        return res.status(400).send("Error: Interview not found")
    }

    // now update new values
    if (req.body.numberRounds !== undefined) {
        interview.numberRounds = req.body.numberRounds;
    }

    if (req.body.interviewType !== undefined) {
        interview.interviewType = req.body.interviewType;
    }


    // save position
    try {
        await interview.save();
    }
    catch (error) {
        console.log(error);
        return res.status(400).send("Error saving updated interview");
    }

    return res.status(200).send("Interview successfully updated")
}

// 
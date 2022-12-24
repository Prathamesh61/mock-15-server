const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { authentication } = require("../middlewares/authentication");

const { TicketModel } = require("../models/Ticket.model");

const ticketRouter = Router();

ticketRouter.get("/", authentication, async (req, res) => {
  const tickets = await TicketModel.find();
  res.send(tickets);
});

ticketRouter.post("/create", authentication, async (req, res) => {
  const nTicket = new TicketModel(req.body);
  try {
    await nTicket.save();
    res.send({ "msg": "Ticket Created", "newTicket": nTicket });
  } catch (err) {
    res.send({ "msg": "something went wrong" });
    console.log(err);
  }
});

ticketRouter.delete("/delete/:ticketId", authentication, async (req, res) => {
  const { ticketId } = req.params;
  const deleted = await TicketModel.findOneAndDelete({ _id: ticketId });
  if (deleted) {
    res.status(200).send({ "msg": "Ticket Deleted", "deletd": deleted });
  } else {
    res.send({ "msg": "unable to delete" });
    console.log(err);
  }
});

ticketRouter.patch("/edit/:ticketId", authentication, async (req, res) => {
  const { ticketId } = req.params;
  const updated = await TicketModel.findOneAndUpdate({ _id: ticketId }, req.body);
  if (updated) {
    res.send({ "msg": "Ticket updated", "updatedTicket": updated });
  } else {
    res.send({ "msg": "unable to update" });
  }
});

module.exports = {
  ticketRouter,
};

const ticketModel = require('../models/ticket.model')

async function createTicket() {
    const countTicket = await ticketModel.find().countDocuments().lean()
    if (countTicket > 1) return
    const dataTicket = [
        {
            tkt_name: "VIP Ticket A",
            tkt_price: 100,
            tkt_total_quantity: 50,
            tkt_remaining_quantity: 50,
            tkt_seat: "A1",
            tkt_start_date: new Date("2024-09-15T10:00:00"),
            tkt_end_date: new Date("2024-09-15T18:00:00"),
            status: "available"
        },
        {
            tkt_name: "Standard Ticket B",
            tkt_price: 70,
            tkt_total_quantity: 100,
            tkt_remaining_quantity: 100,
            tkt_seat: "B1",
            tkt_start_date: new Date("2024-09-15T10:00:00"),
            tkt_end_date: new Date("2024-09-15T18:00:00"),
            status: "available"
        },
        {
            tkt_name: "Economy Ticket C",
            tkt_price: 50,
            tkt_total_quantity: 150,
            tkt_remaining_quantity: 150,
            tkt_seat: "C1",
            tkt_start_date: new Date("2024-09-16T11:00:00"),
            tkt_end_date: new Date("2024-09-16T17:00:00"),
            status: "available"
        },
        {
            tkt_name: "Premium Ticket D",
            tkt_price: 120,
            tkt_total_quantity: 20,
            tkt_remaining_quantity: 20,
            tkt_seat: "D1",
            tkt_start_date: new Date("2024-09-17T09:00:00"),
            tkt_end_date: new Date("2024-09-17T15:00:00"),
            status: "available"
        },
        {
            tkt_name: "Group Ticket E",
            tkt_price: 200,
            tkt_total_quantity: 10,
            tkt_remaining_quantity: 10,
            tkt_seat: "E1",
            tkt_start_date: new Date("2024-09-18T08:00:00"),
            tkt_end_date: new Date("2024-09-18T20:00:00"),
            status: "available"
        },
        {
            tkt_name: "VIP Ticket F",
            tkt_price: 130,
            tkt_total_quantity: 30,
            tkt_remaining_quantity: 30,
            tkt_seat: "F1",
            tkt_start_date: new Date("2024-09-19T14:00:00"),
            tkt_end_date: new Date("2024-09-19T22:00:00"),
            status: "available"
        },
        {
            tkt_name: "Standard Ticket G",
            tkt_price: 80,
            tkt_total_quantity: 70,
            tkt_remaining_quantity: 70,
            tkt_seat: "G1",
            tkt_start_date: new Date("2024-09-20T09:00:00"),
            tkt_end_date: new Date("2024-09-20T17:00:00"),
            status: "available"
        },
        {
            tkt_name: "Economy Ticket H",
            tkt_price: 60,
            tkt_total_quantity: 200,
            tkt_remaining_quantity: 200,
            tkt_seat: "H1",
            tkt_start_date: new Date("2024-09-21T12:00:00"),
            tkt_end_date: new Date("2024-09-21T18:00:00"),
            status: "available"
        },
        {
            tkt_name: "Premium Ticket I",
            tkt_price: 150,
            tkt_total_quantity: 25,
            tkt_remaining_quantity: 25,
            tkt_seat: "I1",
            tkt_start_date: new Date("2024-09-22T10:00:00"),
            tkt_end_date: new Date("2024-09-22T16:00:00"),
            status: "available"
        },
        {
            tkt_name: "Standard Ticket J",
            tkt_price: 90,
            tkt_total_quantity: 90,
            tkt_remaining_quantity: 90,
            tkt_seat: "J1",
            tkt_start_date: new Date("2024-09-23T13:00:00"),
            tkt_end_date: new Date("2024-09-23T19:00:00"),
            status: "available"
        }
    ];

    await ticketModel.insertMany(dataTicket);
    console.log('Tickets have been created successfully!');
}

async function init() {
    await createTicket();
}
init()
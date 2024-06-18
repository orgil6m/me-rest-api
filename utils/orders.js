const { generateTicketId } = require("./tickets");

exports.generateTableTickets = ({ seats, tickets, ticket }) => {
  seats.map((seat) => {
    for (let i = 0; i < seat.selectedSeats; i++) {
      const newTicket = { ...ticket };
      newTicket.ticketId = generateTicketId();
      newTicket.tableId = seat.seatId;
      tickets.push(newTicket);
    }
  });
};

exports.generateStandingTickets = ({ quantity, tickets, ticket }) => {
  for (let i = 0; i < quantity; i++) {
    const newTicket = { ...ticket };
    newTicket.ticketId = ticketIdGenerator();
    tickets.push(newTicket);
  }
};

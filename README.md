# Booking Reservation System

The Booking Reservation System is a RESTful API built with Node.js, Express, and MongoDB. It provides functionalities to manage event ticket reservations, including creating, updating, and canceling bookings. This system is designed to handle various aspects of ticket reservations efficiently.

## Features

- **User Management:** Signup and login functionalities.
- **Booking Management:** Create, confirm, view, and cancel reservations.
- **Ticket Management:** Retrieve available tickets.

## Setup

### Prerequisites

- Node.js (v14 or higher recommended)
- MongoDB

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/tuanahn123/booking-reservation.git
   ```
2. **Navigate to the Project Directory**

   ```bash
   cd booking-reservation
    ```
3. **Install Dependencies**

   ```bash
   npm install
    ```
### Configuration

1. **Create a .env File**
In the root directory of the project, create a .env file with the following content:

   ```bash
   DB_CONNECT_STRING=<your-mongodb-connection-string>
   PORT=<port-server>
   ACCESS_TOKEN_EXPIRES_IN='30m'
   REFRESH_TOKEN_EXPIRES_IN='7d'
   ```
Replace <your-mongodb-connection-string> with your actual MongoDB connection string.


### Running the Server

1. **Start the Server**

    ```bash
   npm run dev
    ```
This will start the server and watch for file changes.

### License
This project is licensed under the MIT License - see the LICENSE file for details.

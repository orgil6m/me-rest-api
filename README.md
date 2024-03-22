# Rest-API Template | ME

The ME-Rest-API is a REST API template designed for quick and scalable development of RESTful APIs. It utilizes Node.js and Express.js for server-side logic and integrates with MongoDB through Mongoose for data management. This document serves as a guide to setting up and using the template for API development.

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/orgil6m/me-rest-api.git
   ```
2. Install dependencies:

   ```bash
    npm install
   ```

3. Set up environment variables: <br/>

   Duplicate the sample.env file, rename it to .env, and customize your environment variables

   ```javascript
   NODE_ENV=DEVELOPMENT
   HOST=http://localhost
   PORT=8000

   DB_CONNECTION_URL="Mongodb Connection String"
   DB_NAME="Database Name"
   ```

4. Start the server:
   <p>For development:</p>

   ```bash
   npm run dev
   ```

   <p>For production:</p>

   ```bash
   npm start
   ```

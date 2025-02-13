import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDB from './config/db.js';
import * as Sentry from "@sentry/node"; 
import { clerkWebhooks } from './controllers/webhooks.js';


// initaialize express
const app = express() 

// connect to database

await connectDB()

// middlewares
app.use(cors())
app.use(express.json())

// routes 

app.get('/', (req, res) => {
  res.send("Api wprking")
})

app.get("/debug-sentry", function mainHandler(req, res) {
   throw new Error("My first Sentry error!");
});

app.post('/webhooks', clerkWebhooks)


// port

const port = process.env.PORT || 5000

Sentry.setupExpressErrorHandler(app);


app.listen(port,(req, res) => {
  console.log(`server is running on port ${port}`)
});

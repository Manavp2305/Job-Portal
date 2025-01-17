import { Webhook } from "svix";
import User from "../models/user.js";
import { json } from "express";

// Api controller to manage clerk user with database

export const clerkWebhooks = async (req, res) => {
  try {
    // Create svix instance with clerk webhook secrets
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // verifying headers

    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    //getting data from request body

    const { data, type } = req.body;

    //switch case for different event

    switch (type) {
      case 'user.created':{

        const userData = {
          _id:data.id,
          email:data.email_address[0].email_address,
          name:data.first_name+" "+data.last_name,
          image:data.image_url,
          resume:'' 
        }
        await User.create(userData)
        res.json({})
        break;

      }

      case 'user.updated':{
        
        const userData = {
          email:data.email_address[0].email_address,
          name:data.first_name+" "+data.last_name,
          image:data.image_url,
        }
        await User.FindByIdAndUpdate(data.id,userData)
        res.json({})
        break;

      }

      case 'user.deleted':{
        await User.FindByIdAndDelete(data.id)
        res.json({})
        break;
      }

      default:
        break;
    }

  } catch (error) {
    console.log(error.message);
    res.json({sucess:false, message:'webhooks Error'});
  }
};

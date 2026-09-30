import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import config from "./config";
import cors from "cors";
import { userRoutes } from "./modules/user/user.route";
import { authRoutes } from "./modules/Auth/auth.route";
import { postRoutes } from "./modules/Posts/post.route";
import { commentsRoute } from "./modules/Commnets/comment.route";
import { notFound } from "./middleware/notFound";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { subscriptionRoute } from "./modules/Subscription/subscription.route";
import { stripe } from "./lib/stripe";


const app: Application = express();

// middlewares
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

const endpointSecret = config.stripe_webhook_secret;

app.post("/api/subscription/webhook", express.raw({type: 'application/json'}), (request, response) => {
  let event = request.body;
  console.log(event, "stripe req.body");
  console.log(request.headers, "stripe requset headers");
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature']!;
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        endpointSecret
      );
    } catch (err: any) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// default app urls:
app.get("/", async (req: Request, res: Response) => {
  res.send("App is working");
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentsRoute);
app.use("/api/subscription", subscriptionRoute);


app.use(notFound);

app.use(globalErrorHandler);

export default app;

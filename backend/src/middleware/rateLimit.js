import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100000000, // 100
  message: { message: "Too many requests, please try again later." },
});

export const formSubmitLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 500, //1
  message: {
    message:
      "You can only submit this form once per minute. Please wait a moment and try again.",
  },
});

export const vehicleAction = rateLimit({
  windowMs: 60 * 1000,
  max: 500, //1
  message: {
    message:
      "You can only add or update vehicle once per minute. Please wait a moment and try again.",
  },
});

export const fetchLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 999, //80
  message: {
    message: "Please wait a moment and try again.",
  },
});

export const vehicleSubmitTicketLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: {
    message: "Please wait a moment and try again.",
  },
});

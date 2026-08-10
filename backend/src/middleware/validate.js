export const validate = (schema) => (req, res, next) => {
  try {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errorCode: "VALIDATION_ERROR",
        errorMessage: "Validation failed for one or more fields.",
        errorContext: {
          fieldErrors: result.error.flatten().fieldErrors,
        },
        timestamp: new Date().toISOString(),
      });
    }

    req.validatedData = result.data;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errorCode: "INTERNAL_SERVER_ERROR",
      errorMessage: "Something went wrong on the server.",
      timestamp: new Date().toISOString(),
    });
  }
};

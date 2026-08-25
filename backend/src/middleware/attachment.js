export const attachFile = (fieldName) => (req, res, next) => {
  if (req.file) {
    req.body[fieldName] = req.file;
  } else if (req.files) {
    req.body[fieldName] = req.files;
  }

  next();
};

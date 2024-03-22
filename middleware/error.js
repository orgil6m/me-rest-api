const errorHandler = (err, req, res, next) => {
  const error = { ...err };
  error.message = err.message;
  if (error.message === "jwt malformed") {
    error.message = "Та логин хийж байж энэ үйлдлийг хийх боломжтой...";
    error.statusCode = 401;
  }

  if (error.name === "CastError") {
    error.message = "Энэ ID буруу бүтэцтэй ID байна!";
    error.statusCode = 400;
  }
  if (error.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    let message = "";
    if (field === "email") {
      message = `${value} и-мейл хаягтай хэрэглэгч бүртгэлтэй байна.`;
    } else if (field === "number") {
      message = `${value} дугаартай хэрэглэгч бүртгэлтэй байна.`;
    }
    error.message = message;
    error.statusCode = 400;
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: error,
  });
};

module.exports = errorHandler;

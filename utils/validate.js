exports.isValidEmail = (email) => {
  let result = true;
  if (!email || email.trim().length === 0) {
    result = false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    result = false;
  }
  return result;
};

exports.isValidNumber = (number) => {
  let result = true;
  if (!number || number.trim().length === 0) {
    result = false;
  }
  const mongolianPhoneNumberRegex =
    /^(85|94|95|99|90|91|96|80|86|88|89|83|93|97|98)\d{6}$/;
  if (!mongolianPhoneNumberRegex.test(number)) {
    result = false;
  }

  return result;
};

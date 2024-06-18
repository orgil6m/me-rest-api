exports.getRandomCode = (length) => {
  return Math.floor(Math.random() * 10 ** length)
    .toString()
    .padStart(length, "0");
};

exports.getRandomNumberInRange = ({ min = 0, max }) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
};

exports.dateDiffInDays = (date1, date2) => {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
};

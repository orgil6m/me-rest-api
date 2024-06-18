const qs = require("qs");
const moment = require("moment");

exports.parseQuery = (query) => {
  const parsedQuery = qs.parse(query);
  const { select, date, search } = parsedQuery;

  ["select", "sort", "page", "limit", "date", "search"].forEach(
    (el) => delete parsedQuery[el]
  );

  return { parsedQuery, select, date, search };
};

exports.setFilters = (query, date, search) => {
  const currentDate = moment().format("YYYY-MM-DD");
  query.isVisible = true;
  let sort = query.sort || {};
  if (search) {
    query = {
      ...query,
      title: { $regex: search, $options: "i" },
    };
  }
  if (date) {
    switch (date) {
      case "today":
        query.date = currentDate;
        break;
      default:
        query.date = date;
        break;
    }
  } else {
    query.date = { $gte: currentDate };
    sort = { date: 1 };
  }

  return { query, sort };
};

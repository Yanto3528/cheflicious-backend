const advancedResults = (model, populate, populate2) => async (
  req,
  res,
  next
) => {
  let query;

  const reqQuery = { ...req.query };

  const removeFields = [
    "select",
    "sort",
    "page",
    "limit",
    "query",
    "following",
    "followers",
    "id",
  ];

  removeFields.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);

  query = model.find(JSON.parse(queryStr));

  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments(query);

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }
  if (populate2) {
    query = query.populate(populate2);
  }
  const results = await query;
  let nextPage;
  let prevPage;
  if (endIndex < total) {
    nextPage = true;
  } else {
    nextPage = false;
  }
  if (startIndex > 0) {
    prevPage = true;
  } else {
    prevPage = false;
  }

  res.advancedResults = {
    total: total,
    count: results.length,
    prevPage,
    nextPage,
    data: results,
  };
  next();
};

module.exports = advancedResults;

const Joi = require('joi');
const knex = require('./knex/knex.js');

/**
 * 
 * @param {*} model Knex Model: Here employee
 * @param {*} search Search term: to search on fields [Email, company]
 * @returns 
 */
const appendSearch = (model, search) => {
  return model.where('email', 'ilike', `%${search}%`)
                .orWhere('company', 'ilike', `%${search}%`)
};

module.exports.getEmployeeList = async (req, res) => {
  try {
    const { page=1, limit=10, search } = req.query;

    // Add offset
    const offset = limit * (page - 1);

    // Schema to validate the input
    const schema = Joi.object({
      page: Joi.number().label('Page'),
      limit: Joi.number().label('Limit'),
      search: Joi.string().label('Search')
    });

    // Validate input with schema
    const validationResult = schema.validate(req.query);

    // Error if the validation failed
    if (validationResult.error) {
      console.log(`Error: ${validationResult.error}`)
      throw new Error(`${validationResult.error}`)
    }


    // Model Initialization
    let model = knex('employee');

    // append search
    model = (search) 
    ? appendSearch(model, search)
    : model;
    
    // Prepare query to retrieve count
    const employeeRecordsCount = model.clone().count();

    // Add pagination
    const employeeModel = model.clone().offset(offset).limit(limit);

    // Query parallel to reduce the response time
    const [data, totalCount] = await Promise.all([employeeModel, employeeRecordsCount]);

    // Prepare final response
    res.status(200).json({
      status: 200,
      message: 'Success',
      data: data,
      size: data.length,
      totalRecords: parseInt(totalCount[0].count),
      currentPage: parseInt(page),
      totalPage: Math.ceil(totalCount[0].count / limit),
      summary: `${parseInt(page)} of ${Math.ceil(totalCount[0].count / limit)} pages`
    })

  } catch (err) {
    // Error response in case of exception.
    res.status(500).json({
      status: 500,
      message: err.message,
    })
  }
}
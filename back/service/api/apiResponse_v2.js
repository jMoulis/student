const statusText = require('./statusText');

module.exports = class ApiResponse {
  constructor(res) {
    this.res = res;
  }

  success(code = 200, data) {
    this.res.set({
      'Content-Type': 'application/json',
    });
    return this.res.status(code).send({ ...data, success: true });
  }

  failure(code = 422, err, data = null) {
    let errorsApi = {};
    if (data) {
      errorsApi = {
        error: {
          detail: data,
        },
      };
    } else if (typeof err !== 'undefined' && err) {
      if (err.errors) {
        Object.keys(err.errors).map(key => {
          const error = {
            status: code,
            source: { pointer: `/data/attributes/${key}` },
            title: statusText[code]
              ? statusText[code].text
              : 'Unknown status code :(',
            detail: err.errors[key].message,
          };
          errorsApi = {
            ...errorsApi,
            [key]: error,
          };
        });
      } else if (err.name === 'CastError') {
        if (err.kind === 'date') {
          errorsApi = {
            ...errorsApi,
            error: {
              detail: 'Wrong date format JJ/MM/YYYY',
            },
          };
        } else {
          errorsApi = {
            ...errorsApi,
            error: {
              detail: err.message,
            },
          };
        }
      }
    }
    this.res.set({
      'Content-Type': 'application/json',
    });
    return this.res.status(code).send({ errors: errorsApi });
  }
};

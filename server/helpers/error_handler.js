exports.status = function(error_code, status, message) {
  var error;
  if (error_code == null) {
    error_code = 100;
  }
  if (status == null) {
    status = 409;
  }
  if (message == null) {
    message = '';
  }
  error = new Error(message);
  error.error_code = error_code;
  error.status = status;
  return error;
};

'use stict';
exports.init = function(req, res, next) {
  var obj;
  obj = {
    response: true
  };
  return res.end(JSON.stringify(obj));
};

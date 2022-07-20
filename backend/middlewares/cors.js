const allowedCors = [
  'ilya-cherevko.students.nomorepartiesxyz.ru',
  'api.ilya-cherevko.student.nomoredomains.xyz',
  'http://ilya-cherevko.students.nomorepartiesxyz.ru',
  'http://api.ilya-cherevko.student.nomoredomains.xyz',
  'https://ilya-cherevko.students.nomorepartiesxyz.ru',
  'https://api.ilya-cherevko.student.nomoredomains.xyz',
  'localhost:3000',
];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['Access-Control-Request-Headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);

    if (method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
      res.header('Access-Control-Allow-Headers', requestHeaders);
      res.end();
    }
  }
  next();
};

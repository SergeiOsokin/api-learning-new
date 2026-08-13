const deleteCookie = (req, res) => {
  res
    .cookie('jwt', '', { domain: '', maxAge: 1 })
    .send({ message: '' })
    .end();
};

module.exports = {
  deleteCookie,
};

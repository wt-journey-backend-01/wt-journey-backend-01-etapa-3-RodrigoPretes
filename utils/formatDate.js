function isValidDate(dateString) {
  const date = new Date(dateString);
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(dateString) &&
    !isNaN(date) &&
    date <= new Date()
  );
}

module.exports = {
    isValidDate
}
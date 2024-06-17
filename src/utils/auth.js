export const isTokenExpired = (token) => {
  if (!token) return true;

  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const expiry = decodedToken.exp;
  const now = Date.now() / 1000;

  console.log(`NOW: ${now}`);
  console.log(`EXPIRY: ${expiry}`);

  return now > expiry;
};

export const getAcessToken = (cookie: string = '') => {
  const token = cookie.split('=')[1];
  return token ? token : cookie;
};

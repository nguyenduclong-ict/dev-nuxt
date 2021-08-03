export const toString = (input: string | string[]) => {
  input = Array.isArray(input) ? input : [];
  let cookieString = "";
  input.forEach((item) => {
    cookieString += item.split(";").shift() + "; ";
  });
  return cookieString.replace(/;( ){0,1}$/, "");
};

const Cookie = {
  toString,
};

export default Cookie;

export default (str: string) => {
  str = str.replace(/([a-z\xE0-\xFF])([A-Z\xC0\xDF])/g, '$1 $2');
  str = str.toLowerCase();
  return str;
};

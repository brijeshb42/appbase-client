export const merge = (oldObj, newObj) => {
  const obj = {};
  for(let key in oldObj) {
    if(oldObj.hasOwnProperty(key)) {
      obj[key] = oldObj[key];
    }
  }
  for(let key in newObj) {
    if(newObj.hasOwnProperty(key)) {
      obj[key] = newObj[key];
    }
  }
  return merge;
};

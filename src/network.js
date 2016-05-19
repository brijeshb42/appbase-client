import 'isomorphic-fetch';

import { readCookie } from './cookie';

let cache = {};

let basePath = '';
let credentials = 'same-origin'

export const setBaseURL = (url) => {
  basePath = url;
};

export const setCredentials = (val) => {
  credentials = val;
}

const method = (url, method='get', options={}) => {
  let contentType = 'application/json;charset=UTF-8';
  if (options.form) {
    contentType = 'multipart/form-data';
  }
  // if (options.form) {
  //   contentType = 'application/x-www-form-urlencoded';
  // }
  const opt = {
    method: method,
    headers: {},
    credentials
  };
  if (!options.form && method !== 'get') {
    opt.headers['Content-Type'] = contentType;
  }
  if (options.data && method !== 'get') {
    opt.body = (options.form) ? options.data : JSON.stringify(options.data);
  }
  if (options.headers) {
    for(let key in options.headers) {
      if (options.headers.hasOwnProperty(key)) {
        opt.headers[key] = options.headers[key];
      }
    }
  }
  return fetch(basePath + url, opt);
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response.json();
  } else {
    const error = new Error(response.statusText);
    error.response = response;
    error.status = response.status;
    throw error
  }
}

const sendFetch = (ftch, success, error, context=null, isGet=false, key='') => {
  return ftch
      .then(checkStatus)
      .then((resp) => {
        if (typeof success === 'function') {
          if (isGet && key !== '') {
            cache[key] = resp;
          }
          success.call(context, resp);
        }
      })
      .catch(err => {
        if (err.response) {
          err.response.json().then((data) => {
            if (typeof error === 'function') {
              error.call(context, {
                data,
                status: err.response.status
              });
            }
          }); 
        }
      });
};

export const Fetch = {
  get: (path, options={}, success=null, error=null, context=null) => {
    let key = path;
    if (options.data) {
      key += '?';
      Object.keys(options.data).forEach((param) => {
        key += param + '=' + options.data[param] + '&'
      });
      key = key.slice(0, -1);
    }
    if (cache.hasOwnProperty(key)) {
      if (typeof success === 'function') {
        success.call(context, cache[key]);
        return;
      }
    }
    const ftch = method(key, 'get', options);
    sendFetch(ftch, success, error, context, true, key);
  },
  post: (path, options={}, success=null, error=null, context=null) => {
    const ftch = method(path, 'post', options);
    sendFetch(ftch, success, error, context);
  },
  del: (path, options={}, success=null, error=null, context=null) => {
    const ftch = method(path, 'delete', options);
    sendFetch(ftch, success, error, context);
  },
  put: (path, options={}, success=null, error=null, context=null) => {
    const ftch = method(path, 'put', options);
    sendFetch(ftch, success, error, context);
  },
  patch: (path, options={}, success=null, error=null, context=null) => {
    const ftch = method(path, 'patch', options);
    sendFetch(ftch, success, error, context);
  },
  clear: (key) => {
    if (typeof key === 'undefined' || !cache[key]) {
      cache = {};
    } else {
      Object.keys(cache).forEach((oldKey) => {
        if (oldKey.indexOf(key) == 0) {
          delete cache[oldKey];
        }
      });
    }
  }
};

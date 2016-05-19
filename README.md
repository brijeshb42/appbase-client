### A client to be used in conjunction with [appbase](https://github.com/shon/appbase).

*appbase-client* exposes a set of basic functions that can help in rapid frontend development @ [Scroll.in](http://scroll.in).

It can be used directly in browser by loading the file in a `script` tag or can be used in `browserify` and `webpack` environments too.

* In browser, it is available in the `window` global with the name `AppBase`.
* In `browserify` or `webpack`, it can be used as:
    * `var AppBase = require('appbase-client')`
    * in ES6, `import AppBase from 'appbase-client'`
* Add the css style in your html `<link href="appbase-client/lib/index.css" rel="stylesheet" type="text/css">`.
### User API

#### `checkSession(errorCallback, showModal, options)`
* `errorCallback` is a function that is called if a valid session is not found.
* `showModal`'s default value is `true`. It shows a modal dialog if the session is not valid and `errorCallback` is called when the modal's button is clicked.
* `options` is an object that should be passes if you want to customise the modal. Its values are documented [here](http://bitwiser.in/medium-style-confirm/).
* This function should be the first to get called before you proceed with your own functions.

#### `isAdmin()`
* Checks session and returns `true` is the current user is an *admin*, otherwise returns false.


#### `getUser()`
* Returns current user's information as an object that is set be server in `userinfo` cookie. Returns `null` if cookie is invalid.

#### `sidToUidGroups()`
* Returns and object like `{uid: 1, groups: ['admin', 'editor']}` from the session cookie. Returns `null` if invalid session.

### Network API

#### `setBaseURL(base)`
* Sets the base url for api calls to `base`. For ex: if a resource exists at `http://api.example.com/1.0/user/1`, you can set the base url to `http://api.example.com/1.0` and then call `Fetch` methods using the endpoints only.

#### `setCredentials(value)`
* This is used by the ajax requests to decide whether to send current cookies or not. Valid values are `same-origin` and `include`. If not set, `same-origin` is used.
* Set to `same-origin` if your client lives on the same domain as the api server.
* Set to `include` if client and server domains are different.

### `Fetch` API
* Fetch has 5 methods corresponding to each http method: `get`, `post`, `put`, `patch` and `del`(instead of `delete`).
* Fetch abstracts away reponse caching so that subsequest `GET` requests for the same resource are returned from memory instead of querying server again.

##### Each method has this signature:

* `methodname(path, options={}, success=null, error=null)`
* `path` is the url endpoint to make the request. For ex: first set the base url using `setBaseURL(base)` and then you can call `Fetch.get('/user/1')`
* `options`: you have to pass `options` object for each function call even if its value is empty(`{}`).

* In `options` you can pass values like:
    * *`data`*:
        * If the called method is `get`, the key-value pair in `data` will be appended to the called url as a querystring.
        * Otherwise it will be posted as JSON body unless `options.form` is `true`. In that case, the data will be posted as `multipart/form-data`.
    * *`form`*
        * If this value is true, `data` will be posted as `Form`, otherwise as `JSON`. Use `form: true` if you are uploading files.
    * *`headers`*
        * Pass additional headers as an object.
* `success` is a function that is passed the success response of a `Fetch` call like `success(data)`.
* `error` is a function that is passed the error response of a `Fetch` call like `error(err)`. Here, `err` has `code` that is the http error code and `response` that is the error data that was sent by the server.

* You can also call `Fetch.clear(prefix)` to manually clear the cache. All cached urls starting with `prefix` will be cleared.
* If you call `Fetch.clear()` without any arguments, the full cache will be cleared.


### Setting up for development:
* `git clone https://github.com/brijeshb42/appbase-client.git`
* `cd appbase-client`
* `npm install`
* Run `npm run dev`. It will start a development server @ `http://localhost:8080` where you can test the API on the window global `AppBase`.
* `npm run build` will build the library for use in production.

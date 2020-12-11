# Development Guide

## Adding a new page

### 1. Create the component

Components can be an entire page, or a portion of a page. Component files go in `app/src/js/components`. If the component has many child components (a page with charts, tables, etc) then consider making a separate directory. In the case of the collections component:

 - `app/src/js/components/collections/index.js` is the parent or main page.
 - A search component could live in `app/src/js/components/collections/search.js`.
 - A bar chart component that is shared with other pages could live in `app/src/js/components/charts/bar.js`.

If a component is very simple, it may not need a unique directory, and can be simply `app/src/js/components/404.js`, for example.

### 2. Add the component to the router

The router tells the app what the component's URL should be. In our app, a route looks like a line of HTML, so we'll call them elements. A route element requires at minimum `path` and `component` properties. Path defines the url path, and component is the name of the component.

When one route is nested within another route, the urls stack. In the following example, the list component's path is `/collections/list`.

```html
<Route path='/collections' component={Collections}>
   <Route path='/list' component={List} />
</Route>
```

The routes are all defined in `app/src/js/main.js`. Make sure to `import` the necessary component at the top of the file.

```javascript
import Collections from './components/collections'
import List from './components/collections/list'
```

More on imports: if the name of the file is `index.js`, you don't need to spell it out, and can instead specify the name of the parent directory. You also don't need to include the file extension (assuming it's `.js`).

For more on Router, including how to pass variables in the url, see the [docs on github](https://github.com/ReactTraining/react-router/tree/master/docs).

### 3. Linking to the component

Instead of using `<a href="path/to/component">` tags, we use `<Link to="path/to/component" />`. This gives us a few convenience features.  Just remember to import the Link module:

```javascript
import { Link } from 'react-router-dom';
```

## Writing an API query

To write an API query, we need to write actions and reducers.

Actions let the interface initiate requests. A good example: a submit button calls an action to initiate a GET. Once the API returns that data, we call another action to place it in the store, along with an accompanying identifier.

Finally, we write a reducer to identify this action and optionally manipulate the data before assigning it a namespaced location.

**A high-level example**:

1. User navigates to the `collections` page, which starts a request to list all active collections.
2. The API responds, and we assign the data to `store.api.collections` as an array with format `[{ id: 1 }, { id: 2 }, { id: 3 }, ...]`.
3. We also assign each individual collection to `store.api.collectionDetail` as an object with format `{ 1: {}, 2: {}, 3: {} }` so it can be easily accessed by single collection pages.
4. The active collections page displays a table by accessing `this.props.api.collections`. The user clicks on a single collection to go to `collections/1`.
5. The single collection component decides whether the collection `{ id: 1 }` exists in `this.props.api.collectionDetail`; if it does, it renders using that data. Otherwise, it initiates a new GET request.

### Writing actions

We might want to write an action to query a single granule by id. To do this, we create a function in `src/js/actions/index.js`.

```javascript
export const getGranule = function (granuleId) {
  return function (dispatch) {
    // do ajax query
    request.get(granuleId, function (err, resp) {
      if (err) { console.log(err); }
      dispatch(setGranule(granuleId, resp[0]));
    })
  };
}
```

Note, `dispatch` allows us to write async actions.

We'll need another action to send this data to the store. Note, we probably don't need to export this action. In the same file:

```javascript
function setGranule (id, granuleData) {
  return { type: SET_GRANULE, id: id, data: granuleData };
}
```

This sends the granule data to the store. We need to specify the primary key so we can identify this action in a reducer function, and place it appropriately. In `actions.js`:

```javascript
export const SET_GRANULE = 'SET_GRANULE';
```

Now in `reducers/api.js` we import the primary key and export a reducer
function, which receives the current state, and the reducer in question.  We
use a primary key, because every action is sent to every reducer. The reducer
doesn't manipulate the current state, but rather returns a new state object
that includes the new data.

Since it is critical to avoid directly mutating the current state in a reducer
function, we use the `createReducer` function from the
[Redux Toolkit](https://redux-toolkit.js.org/).  This not only allows us to
avoid the more verbose `switch` statement syntax that is normally used without
the use of a convenience function such as `createReducer`, but also guarantees
that we never mutate the current state by providing a proxy state object
instead.

We can then conveniently mutate the proxy state object _as if_ we were mutating
the actual state object, and the underlying functionality takes care of
producing a new state object for us, with the fewest possible changes.  The
general pattern for each reducer within the `app/src/js/reducers` directory is
as follows:

```javascript
import { createReducer } from '@reduxjs/toolkit';
import {
  ACTION_TYPE_1,
  ACTION_TYPE_2,
  ...
  ACTION_TYPE_N
} from '../actions/types';

export const initialState = {
  // Some initial state object appropriate for the reducer
  ...
};

export default createReducer(initialState, {
  [ACTION_TYPE_1]: (state, action) => {
    state.path.to.prop1 = action.newValue1;
    state.path.to.prop2 = action.newValue2;
  },
  [ACTION_TYPE_2]: (state, action) => {
    ...
  },
  ...
  [ACTION_TYPE_N]: (state, action) => {
    ...
  }
});
```

Again, note that the `state` parameter for each of the case reducers above is
a proxy object, not the actual state object, but it can be mutated just as if
it were.  Further, you will likely never return a completely new state object,
because that is the purpose of the proxy object instead.  The library manages
the creation of a new object on your behalf.  Of course, if it is absolutely
necessary for some reason to return a new object, you may, but do _not_ mutate
the proxy _and also_ return a new object.  For more details, see
[createReducer](https://redux-toolkit.js.org/api/createReducer).

To reduce some common boilerplate code in the case reducers, there are a few
convenience reducer creators in `app/src/js/reducers/utils/reducer-creators.js`.
See the documentation in that file for more information.

Finally, this allows us to access the data from a component, where component
state is passed as a `prop`:

```javascript
// import the action so we can call it
import { getGranule } from '../actions';

const Granule = React.createClass({

  componentWillMount: function () {
    // params are passed as props to each component,
    // and id is the namespace for the route in `src/js/main.js`.
    const granuleId = this.props.params.id;
    getGranule(granuleId);
  },

  render: function () {
    const granuleId = this.props.params.id;
    const granule = this.props.api.granuleDetail[granuleId]; // should use object-path#get for this
    if (!granule) {
      return <div></div>; // return empty since we have no data yet
    }
    return <div className='granule'>{granule.granuleId}</div>;
  }
});
```

## Writing CSS

We follow a [Bem](http://getbem.com/naming/) naming format.

## Cross-repository Development

What to do when you need to make changes to Cumulus core in order to implement a dashboard need.  For example, if you needed to update the Fake Authentication code on the @cumulus/api in order to test something on the dashboard. These instructions can be extrapolated for other core packages.

The basic steps to follow are:

1. Link your local @cumulus/api code so that it's visible to the dashboard.

    This is a two step process, where you use [`npm link`](https://docs.npmjs.com/cli-commands/link.html) to prepare the @cumulus/api by running `npm link` in the `cumulus/packages/api` directory and then use it in the dashboard project by running `npm link @cumulus/api` in the dashboard root directory.

    When you have done this, you need to make sure that you only use the LocalStack/Elasticsearch portion of the docker-compose containers, e.g. run `npm run start-localstack` and `npm run serve-api` in order to run the linked version of the @cumulus/api.  Do all of your development locally including running unit and integration tests.  When you are satisfied with the changes to the Cumulus core code (and when that is merged) you can do an alpha release of the code by building an alpha release of the package `npm version prerelease --preid=alpha` and then publishing to npm with a tag of `next`. `npm publish --tag next`.  This will upload the contents of your `cumulus/packages/api` to npm with a version that looks like `1.18.1-alpha.0` and a tag of `next`.

2. Update the dashboard to use the alpha package for CI.

    Update package.json to use the alpha version of the @cumulus/api by installing it `npm install @cumulus/api@4.0.1-alpha.0 --save-dev`  This will install the package from npm as well as allow Earthdata Bamboo's CI to run all of the tests.


3. Clean up when core package is released.

    When Cumulus core releases a new version, install it to the dashboard, make sure that tests still pass and then deprecate the alpha version that was published.  `npm deprecate @cumulus/api@1.18.1-alpha.0`, this will remove it from the current version history on npm.  and `npm dist-tag rm @cumulus/api@1.18.1-alpha.0 next` to remove the tag and prevent the alpha package from showing up under current tags.

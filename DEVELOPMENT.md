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

Now in `reducers/api.js` we import the primary key and export a reducer function, which receives the current state, and the reducer in question. We use a primary key, because every action is sent to every reducer. The reducer doesn't manipulate the current state, but rather returns a new state object that includes the new data.

```javascript
import { SET_GRANULE } from '../actions';
export function reducer (currentState, action) {
  const newState = Object.assign({}, currentState);
  if (action.type === SET_GRANULE) {
    newState.granuleDetail[action.id] = action.data;
  }
  return newState;
};
```

Finally, this allows us to access the data from a component, where component state is passed as a `prop`:

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

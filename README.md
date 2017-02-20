# Cumulus Dashboard

Code to generate and deploy the dashboard for the Cumulus API.

## Wireframes and mocks

- [Designs](https://www.dropbox.com/sh/zotoy2nuozizufz/AAAiOpbAv2Gp0BU-HIu5aILra?dl=0)
- [Wireframes](https://www.dropbox.com/s/dm7wct36ijg7sch/nasa-01-15.pdf?dl=0)

# Build

This requires [nvm](https://github.com/creationix/nvm) and node v6.9. To set v6.9 as the default, use `nvm alias default v6.9`.

```(bash)
git clone https://github.com/cumulus-nasa/cumulus-dashboard
cd cumulus-dashboard
nvm use
npm install
npm run serve
```

## Adding a new page

### 1. Create the component

Components can be an entire page, or a portion of a page. Component files go in `app/scripts/components`. If the component has many child components (a page with charts, tables, etc) then consider making a separate directory. In the case of the collections component:

 - `app/scripts/components/collections/index.js` is the parent or main page.
 - A search component could live in `app/scripts/components/collections/search.js`.
 - A bar chart component that is shared with other pages could live in `app/scripts/components/charts/bar.js`.

If a component is very simple, it may not need a unique directory, and can be simply `app/scripts/components/404.js`, for example.

A bare bones component file at `app/scripts/__sample-component__.js` can be copy and pasted into the proper directory.

### 2. Add the component to the router

The router tells the app what the component's URL should be. In our app, a route looks like a line of HTML, so we'll call them elements. A route element requires at minimum `path` and `component` properties. Path defines the url path, and component is the name of the component.

When one route is nested within another route, the urls stack. In the following example, the list component's path is `/collections/list`.

```(html)
<Route path='/collections' component={Collections}>
   <Route path='/list' component={List} />
</Route>
```

The routes are all defined in `app/scripts/main.js`. Make sure to `import` the necessary component at the top of the file.

```(javascript)
import Collections from './components/collections'
import List from './components/collections/list'
```

More on imports: if the name of the file is `index.js`, you don't need to spell it out, and can instead specify the name of the parent directory. You also don't need to include the file extension (assuming it's `.js`).

For more on Router, including how to pass variables in the url, see the [docs on github](https://github.com/ReactTraining/react-router/tree/master/docs).

### 3. Linking to the component

Instead of using `<a href="path/to/component">` tags, we use `<Link to="path/to/component" />`. This gives us a few convenience features.  Just remember to import the Link module:

```(javascript)
import { Link } from 'react-router';
```

## Writing CSS

We follow a [Bem](http://getbem.com/naming/) naming format.

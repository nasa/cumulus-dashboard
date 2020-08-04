// stringify a query configuration object to create
// a unique identifier for chart reducers.
// just a pass-through for JSON.stringify now, but
// centralizing this function lets us change it to
// something better if we need to.
const serialize = (object) => JSON.stringify(object);
export default serialize;

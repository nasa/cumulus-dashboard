import path from 'path';

export default resources = [
  'utils/utils.scss',
  'vendor/bootstrap/_vars.scss'
];

return resources.map((file) => path.resolve(__dirname, file));

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resources = [
  'utils/utils.scss',
  'vendor/bootstrap/_vars.scss'
];

export default resources.map((file) => path.resolve(__dirname, file));

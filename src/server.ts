import http from 'http';
import app from './app';
import { PORT } from './utils/env';

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

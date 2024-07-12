import { Hono } from 'hono'
import { cors } from 'hono/cors'

import blogRoutes from './router/blogRoutes';
import { signUproutes } from './router/signUproutes';

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}>()

app.use(cors())

app.route('/api/v1',signUproutes);
app.route("/api/v1/blog",blogRoutes);



export default app

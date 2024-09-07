import express from 'express';
import callRoutes from './routes/callRoutes';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.use('/api/calls', callRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
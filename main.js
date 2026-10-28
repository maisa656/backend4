const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const users = [];
let nextUserId = 1;

app.use(express.json());
function workingHoursOnly(req, res, next) {
  const now = new Date();
  const hour = now.getHours();

  if (hour < 10 || hour >= 18) {
    return res.status(503).json({
      error: 'Responses are only provided during working hours (10:00–18:00).',
    });
  }

  next();
}
function logRequestDetails(req, res, next) {
  const startedAt = process.hrtime.bigint();
  const device = req.get('user-agent') || 'Unknown device';

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
    console.log(
      `${req.method} ${req.originalUrl} | ${durationMs.toFixed(2)} ms | ${device}`
    );
  });

  next();
}
app.use(workingHoursOnly);

app.get('/', (req, res) => {
  res.json({ message: 'Express middleware assignment API' });
});
function validateNewUser(req, res, next) {
  const { name, email } = req.body || {};
  const missingFields = [];

  if (typeof name !== 'string' || !name.trim()) missingFields.push('name');
  if (typeof email !== 'string' || !email.trim()) missingFields.push('email');

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: 'Required fields are missing or empty.',
      missingFields,
    });
  }

  next();
}

app.post('/api/users', validateNewUser, (req, res) => {
  const user = {
    id: nextUserId++,
    name: req.body.name.trim(),
    email: req.body.email.trim(),
  };

  users.push(user);
  res.status(201).json(user);
});
app.get('/api/users', logRequestDetails, (req, res) => {
  res.json(users);
});

app.get('/api/users/:id', logRequestDetails, (req, res) => {
  const user = users.find((entry) => entry.id === Number(req.params.id));

  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json(user);
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

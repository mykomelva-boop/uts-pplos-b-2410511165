const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data/users.json');

const ensureDB = () => {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify([]));
};

const getUsers = () => {
  ensureDB();
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
};

const saveUsers = (users) => {
  ensureDB();
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
};

const findByEmail = (email) => {
  const users = getUsers();
  return users.find(u => u.email === email) || null;
};

const findById = (id) => {
  const users = getUsers();
  return users.find(u => u.id === id) || null;
};

const createUser = (userData) => {
  const users = getUsers();
  users.push(userData);
  saveUsers(users);
  return userData;
};

const updateUser = (id, updates) => {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates };
  saveUsers(users);
  return users[idx];
};

module.exports = { findByEmail, findById, createUser, updateUser, getUsers };
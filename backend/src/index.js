import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import Database from 'better-sqlite3';

const app = express();
const PORT = process.env.PORT || 4000
app.use(cors());
app.use(express.json());

const db = new Database('./db.sqlite')

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    cpf TEXT,
    birthDate TEXT,
    avatar TEXT,
    createdAt TEXT,
    updatedAt TEXT
  )
`).run()

// GET ALL - READ ALL
app.get('/api/users', (req, res) => {
  const data = db.prepare(`
    SELECT *
    FROM users
    ORDER BY name DESC
  `).all()

  if (data.length === 0) {
    return res.json({ message: 'Nenhum usuário encontrado' })
  }

  res.json(data)
})

// GET - AVERAGE AGE 
app.get('/api/users/age', (req, res) => {
  const result = db.prepare(`
    SELECT AVG(
      (CAST(strftime('%Y', 'now') AS INTEGER) - CAST(strftime('%Y', birthDate) AS INTEGER)) -
      CASE 
        WHEN strftime('%m-%d', 'now') < strftime('%m-%d', birthDate) THEN 1 
        ELSE 0 
      END
    ) AS media_idade
    FROM users
    WHERE birthDate IS NOT NULL
  `).get()
  
  if (!result || result.media_idade === null) {
    return res.status(404).json({ media_idade: 0, message: 'Nenhum usuário com data de nascimento cadastrada' })
  }
  
  res.json({ 
    media_idade: Math.round(result.media_idade)
  })
})

// GET - NEW USERS(7 DAYS)
app.get('/api/users/new', (req, res) => {
  const result = db.prepare(`
    SELECT *
    FROM users
    WHERE createdAt >= datetime('now', '-7 days');
  `).all()

  if (!result || result.length === 0) {
    return res.status(404).json({ message: 'Nenhum usuário novo nos últimos 7 dias' })
  }

  res.status(200).json({
    novos_users: result,
    total: result.length
  })
})
// GET - READ 
app.get('/api/users/:id', (req, res) => {
  const user = db.prepare(`SELECT * FROM users WHERE id = ?`).get(req.params.id)
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' })
  res.status(200).json(user)
})

// POST - CREATE
app.post('/api/users', (req, res) => {
  const { name, email, password, cpf, birthDate, avatar } = req.body

   if (!name || !email || !password || !cpf || !birthDate || !avatar) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' })
  }

  const exists = db.prepare(`SELECT 1 FROM users WHERE email = ?`).get(email)
  if (exists) {
    return res.status(400).json({ message: 'Email já cadastrado' })
  }

  const id = uuidv4()
  const now = new Date().toISOString()

  db.prepare(`
    INSERT INTO users (id, name, email, password, cpf, birthDate, avatar, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, name, email, password, cpf, birthDate, avatar, now, now)

  res.status(201).json({
    id, name, email, cpf, birthDate, avatar,
    createdAt: now,
    updatedAt: now
  })
})

//PUT - UPDATE
app.put('/api/users/:id', (req, res) => {
  const user = db.prepare(`SELECT * FROM users WHERE id = ?`).get(req.params.id)
  if (!user) {
    return res.status(404).json({ message: 'Não encontrado' })
  }

  const { name, email, password, cpf, birthDate, avatar } = req.body
  const updatedAt = new Date().toISOString()

  db.prepare(`
    UPDATE users
    SET name = ?, email = ?, password = ?, cpf = ?, birthDate = ?, avatar = ?, updatedAt = ?
    WHERE id = ?
  `).run(
    name ?? user.name,
    email ?? user.email,
    password ?? user.password,
    cpf ?? user.cpf,
    birthDate ?? user.birthDate,
    avatar ?? user.avatar,
    updatedAt,
    req.params.id
  )

  res.status(200).json({ ...user, ...req.body, updatedAt })
})

// DELETE 
app.delete('/api/users/:id', (req, res) => {
  const result = db.prepare(`DELETE FROM users WHERE id = ?`).run(req.params.id)
  if (result.changes === 0) {
    return res.status(404).json({ message: 'Usuário não encontrado' })
  }
  res.status(200).send()
})



app.listen(PORT, () => console.log(`✅ Backend rodando na porta ${PORT}`))
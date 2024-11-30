const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const Minio = require('minio');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
require('dotenv').config();

// Инициализация PostgreSQL
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Инициализация MinIO клиента
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

// Инициализация Express
const app = express();
app.use(express.json());
const port = 3000;

// Конфигурация multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Секретный ключ для JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Подключаем Swagger
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger настройка
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'File Upload API',
      version: '1.0.0',
      description: 'API для работы с файлами и пользователями',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./server.js'], // Указываем файл с API для генерации документации
};

// Генерация документации
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Подключение Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Функция для проверки JWT токена
function authenticateJWT(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const jwtToken = token.split(' ')[1]; // Извлекаем токен из заголовка 'Authorization'

  jwt.verify(jwtToken, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }
    req.user = user;
    next();
  });
}

// 1. Регистрация пользователя
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *       400:
 *         description: Все поля обязательны для заполнения
 *       500:
 *         description: Ошибка регистрации
 */
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING id',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully', userId: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// 2. Авторизация (логин)
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Логин пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешный логин
 *       400:
 *         description: Неверные данные
 *       500:
 *         description: Ошибка входа
 */
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// 3. Получение данных пользователя
/**
 * @swagger
 * /me:
 *   get:
 *     summary: Получить данные текущего пользователя
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Данные пользователя
 *       401:
 *         description: Требуется токен
 *       500:
 *         description: Ошибка получения данных
 */
app.get('/me', authenticateJWT, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [req.user.userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

// 4. Загрузка файла в MinIO
/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Загрузить файл в MinIO
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Файл успешно загружен
 *       400:
 *         description: Нет файла для загрузки
 *       500:
 *         description: Ошибка загрузки файла
 */
app.post('/upload', authenticateJWT, upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const filePath = path.join(__dirname, 'uploads', file.filename);
  const fileName = file.filename;

  minioClient.fPutObject(process.env.MINIO_BUCKET_NAME, fileName, filePath, (err, etag) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading file to MinIO', error: err });
    }

    fs.unlinkSync(filePath);

    res.status(200).json({ message: 'File uploaded successfully', etag });
  });
});

// 5. Выгрузка файла из MinIO
/**
 * @swagger
 * /download/{filename}:
 *   get:
 *     summary: Выгрузить файл из MinIO
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: filename
 *         in: path
 *         required: true
 *         description: Имя файла для выгрузки
 *     responses:
 *       200:
 *         description: Файл выгружен
 *       500:
 *         description: Ошибка выгрузки файла
 */
app.get('/download/:filename', authenticateJWT, (req, res) => {
  const { filename } = req.params;

  minioClient.getObject(process.env.MINIO_BUCKET_NAME, filename, (err, dataStream) => {
    if (err) {
      return res.status(500).json({ message: 'Error downloading file from MinIO', error: err });
    }

    res.setHeader('Content-Disposition', 'attachment; filename=' + filename);
    dataStream.pipe(res);
  });
});

// 6. Удаление файла из MinIO
/**
 * @swagger
 * /delete/{filename}:
 *   delete:
 *     summary: Удалить файл из MinIO
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: filename
 *         in: path
 *         required: true
 *         description: Имя файла для удаления
 *     responses:
 *       200:
 *         description: Файл успешно удален
 *       500:
 *         description: Ошибка удаления файла
 */
app.delete('/delete/:filename', authenticateJWT, (req, res) => {
  const { filename } = req.params;

  minioClient.removeObject(process.env.MINIO_BUCKET_NAME, filename, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting file from MinIO', error: err });
    }

    res.status(200).json({ message: 'File deleted successfully' });
  });
});

// 7. Получение метрик (средние значения)
app.get('/metrics', authenticateJWT, async (req, res) => {
  try {
    const objects = await minioClient.listObjects(process.env.MINIO_BUCKET_NAME, '', true);
    const files = [];
    for await (const obj of objects) {
      files.push(obj.name);
    }

    const metrics = files.map((file) => ({
      file,
      averageLoanAmount: getAverageLoanAmountFromCSV(file),
    }));

    res.status(200).json({ files, metrics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching metrics' });
  }
});

// Функция для расчета среднего значения LoanAmount из CSV
async function getAverageLoanAmountFromCSV(filename) {
  let total = 0;
  let count = 0;

  return new Promise((resolve, reject) => {
    minioClient.getObject(process.env.MINIO_BUCKET_NAME, filename, (err, dataStream) => {
      if (err) {
        reject(err);
      }

      dataStream.pipe(csv())
        .on('data', (row) => {
          total += parseFloat(row.LoanAmount) || 0;
          count++;
        })
        .on('end', () => {
          resolve(count > 0 ? total / count : 0);
        });
    });
  });
}

// Старт сервера
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

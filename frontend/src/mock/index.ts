import { cpus } from "os";
import cluster from "cluster";
import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { createClient, type RedisClientType } from "redis";
import bcrypt from 'bcrypt';


const saltRounds = 10;
const client: RedisClientType = createClient();
client.connect(); // 新增连接操作

// 内存数据库
const users: Array<{
    id: number;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
}> = [];

// 限流配置
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100, // 每个IP限制100次请求
    standardHeaders: true,
    legacyHeaders: false,
});

// JWT配置
const SECRET_KEY = "BLOG_SECRET_KEY";
const generateToken = (user: { id: number; username: string }) =>
    jwt.sign(user, SECRET_KEY, { expiresIn: "2h" });

// 缓存中间件（添加类型注解）
const cacheMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const key = `user:${req.params.id}`;

    try {
        const data = await client.get(key);
        if (data) {
            res.json(JSON.parse(data));
        } else {
            next();
        }
    } catch (err) {
        throw err;
    }
};

if (cluster.isPrimary) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers（使用 CPU 核心数）
    const numCPUs = cpus().length;
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    const app = express();
    app.use(cors({
        origin: 'http://localhost:5173', // 前端开发地址
        credentials: true
    }));
    app.use(bodyParser.json());

    app.use("/login", apiLimiter);
    app.use("/register", apiLimiter);

    // 注册接口（添加类型注解）
    app.post<{}, { message: string }, {
        username: string;
        email: string;
        password: string;
    }>("/register", async (req, res) => {
        const {username, email, password} = req.body;
        console.log('收到注册请求:', req.body);
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        if (users.some((u) => u.username === username)) {
            return res.status(400).json({message: "用户名已存在"});
        }

        if (users.some((u) => u.email === email)) {
            return res.status(400).json({message: "邮箱已注册"});
        }

        const newUser = {
            id: Date.now(),
            username,
            email,
            password: hashedPassword,
            createdAt: new Date(),
        };

        users.push(newUser);
        res.status(201).json({message: "注册成功"});
    });

    // 登录接口（添加类型注解）
    app.post<{}, { message?: string; token: string; user: { id: number; username: string; email: string; } }, {
        identifier: string;
        password: string;
    }>("/login", async (req, res) => {
        const {identifier, password} = req.body;
        const user = users.find((u) =>
            (u.username === identifier || u.email === identifier) &&
            u.password === password
        );

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                message: "用户名或密码错误",
                token: '',
                user: {id: 0, username: '', email: ''}
            });
        }

        const token = generateToken({id: user.id, username: user.username});

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        });
    });

    // 用户查询接口（添加类型注解）
    app.get<{ id: string }>("/users/:id", cacheMiddleware, (req, res) => {
        const userId = parseInt(req.params.id, 10);
        const user = users.find((u) => u.id === userId);
        if (user) {
            client.setEx(`user:${userId}`, 3600, JSON.stringify(user));
            res.json(user);
        } else {
            res.status(404).json({ message: "用户未找到" });
        }
    });

    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} started on port ${PORT}`);
    });
}

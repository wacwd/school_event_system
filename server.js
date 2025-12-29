const express = require('express');
const Redis = require('ioredis');
const amqp = require('amqplib');
const config = require('./config');
const app = express();

app.use(require('cors')()); // 允许跨域
app.use(express.json());

const redis = new Redis(config.redis);
let channel = null;

// 连接 RabbitMQ
async function connectMQ() {
    const conn = await amqp.connect(config.rabbitmq.url);
    channel = await conn.createChannel();
    await channel.assertQueue(config.rabbitmq.queue, { durable: true });
    console.log('[MQ] 生产者已就绪');
}
connectMQ();

// 定义 Lua 脚本 (原子扣减库存)
const luaScript = `
    if redis.call('sismember', KEYS[2], ARGV[1]) == 1 then
        return -1 -- 重复报名
    end
    local stock = tonumber(redis.call('get', KEYS[1]))
    if stock <= 0 then
        return 0 -- 库存不足
    end
    redis.call('decr', KEYS[1])
    redis.call('sadd', KEYS[2], ARGV[1])
    return 1 -- 成功
`;

// 报名接口
app.post('/api/enroll', async (req, res) => {
    const { userId, eventId } = req.body;

    if (!channel) return res.status(500).json({ msg: '系统初始化中' });

    const stockKey = `event:stock:${eventId}`;
    const userKey = `event:users:${eventId}`;

    try {
        // 执行 Lua 脚本
        const result = await redis.eval(luaScript, 2, stockKey, userKey, userId);

        if (result === -1) {
            return res.json({ code: 400, msg: '您已报名，请勿重复点击' });
        }
        if (result === 0) {
            return res.json({ code: 200, msg: '手慢了，名额已抢完' });
        }
        if (result === 1) {
            // 抢单成功，发送消息到 MQ
            const msg = JSON.stringify({ userId, eventId });
            channel.sendToQueue(config.rabbitmq.queue, Buffer.from(msg));
            return res.json({ code: 200, msg: '抢号成功！正在排队入库...' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: '服务器繁忙' });
    }
});

app.listen(3000, () => console.log('[Web Server] 运行在 http://localhost:3000'));
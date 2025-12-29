const Redis = require('ioredis');
const mysql = require('mysql2/promise');
const config = require('./config');

const redis = new Redis(config.redis);

async function preheat() {
    const conn = await mysql.createConnection(config.mysql);
    
    // 读取数据库中的活动
    const [rows] = await conn.execute('SELECT * FROM events WHERE id = ?', [1]);
    const event = rows[0];

    if (event) {
        // 1. 设置 Redis 库存
        await redis.set(`event:stock:${event.id}`, event.stock);
        // 2. 清空之前的去重记录
        await redis.del(`event:users:${event.id}`);
        console.log(`[预热完成] 活动: ${event.name}, 库存: ${event.stock} 已写入 Redis`);
    }
    
    await conn.end();
    redis.disconnect();
}

preheat();
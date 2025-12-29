const amqp = require('amqplib');
const mysql = require('mysql2/promise');
const config = require('./config');

async function startWorker() {
    const db = await mysql.createPool(config.mysql);
    const conn = await amqp.connect(config.rabbitmq.url);
    const channel = await conn.createChannel();

    await channel.assertQueue(config.rabbitmq.queue, { durable: true });
    
    // 每次只处理 1 条消息，防止压垮数据库
    channel.prefetch(1); 

    console.log('[Worker] 消费者启动，等待任务...');

    channel.consume(config.rabbitmq.queue, async (msg) => {
        if (!msg) return;

        const data = JSON.parse(msg.content.toString());
        const { userId, eventId } = data;

        try {
            // 写入 MySQL
            await db.execute(
                'INSERT INTO enrollments (user_id, event_id) VALUES (?, ?)',
                [userId, eventId]
            );
            console.log(`[入库成功] 用户:${userId} 活动:${eventId}`);
            
            // 告诉 MQ 消息处理完了，可以删掉了
            channel.ack(msg);
        } catch (err) {
            // 如果唯一索引报错，说明重复，也确认消息（避免死循环）
            if (err.code === 'ER_DUP_ENTRY') {
                console.log(`[重复忽略] 用户:${userId}`);
                channel.ack(msg);
            } else {
                console.error('[入库失败]', err);
                // 也可以选择 nack 让消息重回队列，这里简化处理
                channel.ack(msg); 
            }
        }
    });
}

startWorker();
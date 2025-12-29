module.exports = {
    mysql: {
        host: 'localhost',
        user: 'root',      // 换成你的MySQL用户名
        password: 'root', // 换成你的MySQL密码
        database: 'school_event'
    },
    redis: {
        host: 'localhost',
        port: 6379
    },
    rabbitmq: {
        url: 'amqp://localhost',
        queue: 'enroll_queue'
    }
};
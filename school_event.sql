-- 1. 活动表
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
);

-- 2. 报名表
CREATE TABLE `enrollments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `event_id` int NOT NULL,
  `status` varchar(20) DEFAULT 'SUCCESS',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_event` (`user_id`,`event_id`) -- 唯一索引防刷
);

-- 3. 插入一个测试活动（ID=1，库存10个，方便测试）
INSERT INTO events (id, name, stock) VALUES (1, '校园十佳歌手大赛', 10);
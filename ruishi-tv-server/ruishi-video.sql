/*
 Navicat Premium Data Transfer

 Source Server         : phpstudy_mysql_8.0.12
 Source Server Type    : MySQL
 Source Server Version : 80012
 Source Host           : localhost:3306
 Source Schema         : ruishi-video

 Target Server Type    : MySQL
 Target Server Version : 80012
 File Encoding         : 65001

 Date: 03/03/2023 19:50:28
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin`  (
  `admin_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '管理员名',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '管理员密码',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建日期',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '创建日期',
  PRIMARY KEY (`admin_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of admin
-- ----------------------------
INSERT INTO `admin` VALUES (1, 'Gary', '$2a$10$RfOP3yjcyuWuboOUTmVXYeOD7yFeUOiYf/RwM2qT8gxt0UueUDTYC', '2023-02-20 22:46:24.067750', '2023-02-20 22:46:24.067750');
INSERT INTO `admin` VALUES (2, 'admin', '$2a$10$7l/9HF64Aod59XpnaGN8fuUhXoeSDnlVcq4VUod5fJY56XjZJ9CnS', '2023-02-20 22:46:30.664492', '2023-02-20 22:46:30.664492');

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category`  (
  `cate_id` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NOT NULL DEFAULT 0 COMMENT '父级id，一级id为0',
  `sort` int(11) NOT NULL DEFAULT 0 COMMENT '排序',
  `cate_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '分类名称',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`cate_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 33 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES (16, 0, 0, '频道', '2023-02-23 19:54:19.608882', '2023-02-23 19:54:19.608882');
INSERT INTO `category` VALUES (17, 0, 0, '分类', '2023-02-23 19:56:04.073521', '2023-02-23 19:56:04.073521');
INSERT INTO `category` VALUES (18, 17, 0, '日本动漫', '2023-02-23 19:56:12.308040', '2023-02-23 19:56:12.308040');
INSERT INTO `category` VALUES (19, 17, 0, '国产动漫', '2023-02-23 19:56:19.160474', '2023-02-23 19:56:19.160474');
INSERT INTO `category` VALUES (20, 17, 0, '欧美动漫', '2023-02-23 19:56:24.588624', '2023-02-23 19:56:24.588624');
INSERT INTO `category` VALUES (21, 16, 0, '热门新番', '2023-02-23 19:56:30.357188', '2023-02-23 19:56:30.357188');
INSERT INTO `category` VALUES (22, 16, 0, '动漫大全', '2023-02-23 19:56:36.845063', '2023-02-23 19:56:36.845063');
INSERT INTO `category` VALUES (23, 16, 0, '动漫电影', '2023-02-23 19:56:42.772274', '2023-02-23 19:56:42.772274');
INSERT INTO `category` VALUES (24, 16, 0, '电影', '2023-02-23 19:56:56.519240', '2023-02-23 19:56:56.519240');
INSERT INTO `category` VALUES (25, 0, 0, '年份', '2023-02-23 19:57:05.699982', '2023-02-23 19:57:05.699982');
INSERT INTO `category` VALUES (26, 25, 0, '2023', '2023-02-23 19:57:09.292558', '2023-02-23 19:57:09.292558');
INSERT INTO `category` VALUES (27, 25, 0, '2022', '2023-02-23 19:57:12.934821', '2023-02-23 19:57:12.934821');
INSERT INTO `category` VALUES (28, 25, 0, '2021', '2023-02-23 19:57:16.751881', '2023-02-23 19:57:16.751881');
INSERT INTO `category` VALUES (29, 25, 0, '2020', '2023-02-23 19:57:19.752600', '2023-02-23 19:57:19.752600');
INSERT INTO `category` VALUES (30, 25, 0, '2019', '2023-02-23 19:57:23.856100', '2023-02-23 19:57:23.856100');
INSERT INTO `category` VALUES (31, 25, 0, '2018', '2023-02-23 19:57:28.866447', '2023-02-23 19:57:28.866447');
INSERT INTO `category` VALUES (32, 25, 0, '2017', '2023-02-23 19:57:32.317823', '2023-02-23 19:57:32.317823');

-- ----------------------------
-- Table structure for collect
-- ----------------------------
DROP TABLE IF EXISTS `collect`;
CREATE TABLE `collect`  (
  `collect_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NULL DEFAULT NULL,
  `video_id` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`collect_id`) USING BTREE,
  UNIQUE INDEX `REL_925eb8e2936b287160bbbb72ed`(`video_id` ASC) USING BTREE,
  INDEX `FK_7c373025d1a6a2f69abb86e8fed`(`user_id` ASC) USING BTREE,
  CONSTRAINT `FK_7c373025d1a6a2f69abb86e8fed` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_925eb8e2936b287160bbbb72edf` FOREIGN KEY (`video_id`) REFERENCES `video` (`video_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of collect
-- ----------------------------
INSERT INTO `collect` VALUES (2, 1, 21);
INSERT INTO `collect` VALUES (5, 1, 20);

-- ----------------------------
-- Table structure for danmu
-- ----------------------------
DROP TABLE IF EXISTS `danmu`;
CREATE TABLE `danmu`  (
  `danmu_id` int(11) NOT NULL AUTO_INCREMENT,
  `time` int(11) NOT NULL COMMENT '弹幕出现的时间',
  `text` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '弹幕内容',
  `color` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '#FFFFFF' COMMENT '弹幕颜色',
  `part_id` int(11) NULL DEFAULT NULL,
  `user_id` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`danmu_id`) USING BTREE,
  INDEX `FK_57886eacee5cbc0d0cae4f9c710`(`part_id` ASC) USING BTREE,
  INDEX `FK_cdb087265b91f57c487b8fbead6`(`user_id` ASC) USING BTREE,
  CONSTRAINT `FK_57886eacee5cbc0d0cae4f9c710` FOREIGN KEY (`part_id`) REFERENCES `parts` (`part_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_cdb087265b91f57c487b8fbead6` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 42 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of danmu
-- ----------------------------
INSERT INTO `danmu` VALUES (8, 2, '回场方常美那眼在料织龙参连经导。', '#dcf279', 24, 1);
INSERT INTO `danmu` VALUES (9, 5, '回场方常美那眼在料织龙参连经导。', '#dcf279', 24, 1);
INSERT INTO `danmu` VALUES (10, 9, '回场方常美那眼在料织龙参连经导。', '#dcf279', 24, 1);
INSERT INTO `danmu` VALUES (11, 4, '我是第一！', '#d6fa3c', 24, 1);
INSERT INTO `danmu` VALUES (12, 13, '我是第二', '#b5814b', 24, 1);
INSERT INTO `danmu` VALUES (13, 22, '第三', '#a0473b', 24, 1);
INSERT INTO `danmu` VALUES (14, 23, '123', '#6b9613', 24, 1);
INSERT INTO `danmu` VALUES (15, 3, '123', '#80a75a', 24, 1);
INSERT INTO `danmu` VALUES (16, 5, '456', '#54877e', 24, 1);
INSERT INTO `danmu` VALUES (17, 5, '123', '#cc7600', 24, 1);
INSERT INTO `danmu` VALUES (18, 6, '123', '#7fea97', 24, 1);
INSERT INTO `danmu` VALUES (19, 7, '123', '#94b71b', 24, 1);
INSERT INTO `danmu` VALUES (20, 8, '123', '#e149fb', 24, 1);
INSERT INTO `danmu` VALUES (21, 9, '123', '#22b609', 24, 1);
INSERT INTO `danmu` VALUES (22, 9, '123', '#cbd36a', 24, 1);
INSERT INTO `danmu` VALUES (23, 10, '123', '#03c7c7', 24, 1);
INSERT INTO `danmu` VALUES (24, 11, '23', '#44deda', 24, 1);
INSERT INTO `danmu` VALUES (25, 12, '124', '#70ef6f', 24, 1);
INSERT INTO `danmu` VALUES (26, 12, '123', '#1798ef', 24, 1);
INSERT INTO `danmu` VALUES (27, 13, '123', '#8c429d', 24, 1);
INSERT INTO `danmu` VALUES (28, 6, 'GGG', '#df0abb', 24, 1);
INSERT INTO `danmu` VALUES (29, 8, 'HHHH', '#1f0c51', 24, 1);
INSERT INTO `danmu` VALUES (30, 10, 'JJJJ', '#591aea', 24, 1);
INSERT INTO `danmu` VALUES (31, 3, '回场方常美那眼在料织龙参连经导。', '#dcf279', 25, 1);
INSERT INTO `danmu` VALUES (32, 3, '回场方常美那眼在料织龙参连经导。', '#dcf279', 25, 1);
INSERT INTO `danmu` VALUES (36, 1, '划千拉么接象事县团作好江根求成历了力。', '#79f298', 25, 1);
INSERT INTO `danmu` VALUES (37, 1, '划千拉么接象事县团作好江根求成历了力。', '#79f298', 25, 1);
INSERT INTO `danmu` VALUES (38, 1, '划千拉么接象事县团作好江根求成历了力。', '#79f298', 25, 1);
INSERT INTO `danmu` VALUES (39, 3, '123456789', '#98e8b2', 24, 1);
INSERT INTO `danmu` VALUES (40, 7, '123436', '#93960e', 24, 1);
INSERT INTO `danmu` VALUES (41, 2000, '123123asdasdasd', '#183fe4', 24, 1);

-- ----------------------------
-- Table structure for history
-- ----------------------------
DROP TABLE IF EXISTS `history`;
CREATE TABLE `history`  (
  `history_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NULL DEFAULT NULL,
  `video_id` int(11) NULL DEFAULT NULL,
  `time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`history_id`) USING BTREE,
  UNIQUE INDEX `REL_10d9fd22054df3be689913df40`(`video_id` ASC) USING BTREE,
  INDEX `FK_ea92daa642af67e2a924a5547d5`(`user_id` ASC) USING BTREE,
  CONSTRAINT `FK_10d9fd22054df3be689913df403` FOREIGN KEY (`video_id`) REFERENCES `video` (`video_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_ea92daa642af67e2a924a5547d5` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of history
-- ----------------------------
INSERT INTO `history` VALUES (1, 1, 21, '2023-03-01 18:40:55.092166');
INSERT INTO `history` VALUES (2, 1, 22, '2023-02-28 19:09:17.000000');
INSERT INTO `history` VALUES (3, 1, 23, '2023-02-01 19:09:35.000000');
INSERT INTO `history` VALUES (4, 1, 20, '2023-03-01 19:09:57.994220');

-- ----------------------------
-- Table structure for parts
-- ----------------------------
DROP TABLE IF EXISTS `parts`;
CREATE TABLE `parts`  (
  `part_id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '每一集的视频介绍',
  `duration` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '0' COMMENT '视频时长 单位：秒',
  `url` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '视频链接',
  `cover` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '视频封面',
  `tags` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '视频标签',
  `video_id` int(11) NULL DEFAULT NULL,
  `url2` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '视频链接2，MP4链接',
  PRIMARY KEY (`part_id`) USING BTREE,
  INDEX `FK_99570297e14d2243f85c8e52765`(`video_id` ASC) USING BTREE,
  CONSTRAINT `FK_99570297e14d2243f85c8e52765` FOREIGN KEY (`video_id`) REFERENCES `video` (`video_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 49 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of parts
-- ----------------------------
INSERT INTO `parts` VALUES (24, '初入星海10', '1159.996', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/36f56de4243791579923764566/v.f100210.m3u8', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/00454dc3243791579912895247/coverBySnapshot/coverBySnapshot_10_0.jpg', NULL, 20, 'https://1259476264.vod2.myqcloud.com/fc1b1dadvodgzp1259476264/36f56de4243791579923764566/f0.mp4');
INSERT INTO `parts` VALUES (25, '初入星海10', '62.64', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/92f2803c243791579914556442/v.f100210.m3u8', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/92f2803c243791579914556442/coverBySnapshot/coverBySnapshot_10_0.jpg', NULL, 20, 'https://1259476264.vod2.myqcloud.com/fc1b1dadvodgzp1259476264/92f2803c243791579914556442/f0.mp4');
INSERT INTO `parts` VALUES (26, '初入星海11', '1159.92', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/00454dc3243791579912895247/v.f100210.m3u8', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/36f56de4243791579923764566/coverBySnapshot/coverBySnapshot_10_0.jpg', NULL, 20, 'https://1259476264.vod2.myqcloud.com/fc1b1dadvodgzp1259476264/00454dc3243791579912895247/f0.mp4');
INSERT INTO `parts` VALUES (27, '魔道争锋', '190.012', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/c03bdcb5243791579925015551/v.f100210.m3u8', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/c03bdcb5243791579925015551/coverBySnapshot/coverBySnapshot_10_0.jpg', NULL, 21, 'https://1259476264.vod2.myqcloud.com/fc1b1dadvodgzp1259476264/c03bdcb5243791579925015551/f0.mp4');
INSERT INTO `parts` VALUES (28, '魔道争锋2', '1378.04', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/7365dd37243791579924035813/v.f100210.m3u8', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/7365dd37243791579924035813/coverBySnapshot/coverBySnapshot_10_0.jpg', NULL, 21, 'https://1259476264.vod2.myqcloud.com/fc1b1dadvodgzp1259476264/7365dd37243791579924035813/f0.mp4');
INSERT INTO `parts` VALUES (29, '01第一集', '33.08', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/8165e5e0243791579924637742/v.f100210.m3u8', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/8165e5e0243791579924637742/coverBySnapshot/coverBySnapshot_10_0.jpg', NULL, 22, 'https://1259476264.vod2.myqcloud.com/fc1b1dadvodgzp1259476264/8165e5e0243791579924637742/f0.mp4');
INSERT INTO `parts` VALUES (30, '02第二集', '33.16', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/7ca62917243791579924421526/v.f100210.m3u8', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/7ca62917243791579924421526/coverBySnapshot/coverBySnapshot_10_0.jpg', NULL, 22, 'https://1259476264.vod2.myqcloud.com/fc1b1dadvodgzp1259476264/7ca62917243791579924421526/f0.mp4');
INSERT INTO `parts` VALUES (31, '03第三集', '33.12', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/3937dcbb243791579923853090/v.f100210.m3u8', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/3937dcbb243791579923853090/coverBySnapshot/coverBySnapshot_10_0.jpg', NULL, 22, 'https://1259476264.vod2.myqcloud.com/fc1b1dadvodgzp1259476264/3937dcbb243791579923853090/f0.mp4');
INSERT INTO `parts` VALUES (32, '01', '33.16', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/7a8859f1243791579924353300/v.f100210.m3u8', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/7a8859f1243791579924353300/coverBySnapshot/coverBySnapshot_10_0.jpg', NULL, 23, 'https://1259476264.vod2.myqcloud.com/fc1b1dadvodgzp1259476264/7a8859f1243791579924353300/f0.mp4');
INSERT INTO `parts` VALUES (35, '魔道争锋3', '1088.252', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/e3c367ae243791580242068291/v.f100210.m3u8', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/e3c367ae243791580242068291/coverBySnapshot/coverBySnapshot_10_0.jpg', NULL, 21, 'https://1259476264.vod2.myqcloud.com/fc1b1dadvodgzp1259476264/e3c367ae243791580242068291/f0.mp4');
INSERT INTO `parts` VALUES (36, '01集', '45.607', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/2bdd7f72243791580260498171/v.f100210.m3u8', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/2bdd7f72243791580260498171/coverBySnapshot/coverBySnapshot_10_0.jpg', NULL, 24, 'https://1259476264.vod2.myqcloud.com/fc1b1dadvodgzp1259476264/2bdd7f72243791580260498171/f0.mp4');
INSERT INTO `parts` VALUES (37, '02集', '45.607', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/dae19153243791580245747721/v.f100210.m3u8', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/dae19153243791580245747721/coverBySnapshot/coverBySnapshot_10_0.jpg', NULL, 24, 'https://1259476264.vod2.myqcloud.com/fc1b1dadvodgzp1259476264/dae19153243791580245747721/f0.mp4');
INSERT INTO `parts` VALUES (38, '03集', '45.607', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/5800eac8243791580223033096/v.f100210.m3u8', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/5800eac8243791580223033096/coverBySnapshot/coverBySnapshot_10_0.jpg', NULL, 24, 'https://1259476264.vod2.myqcloud.com/fc1b1dadvodgzp1259476264/5800eac8243791580223033096/f0.mp4');
INSERT INTO `parts` VALUES (40, '04集', '68.4', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/8d9d5251243791580244704871/v.f100210.m3u8', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/8d9d5251243791580244704871/coverBySnapshot/coverBySnapshot_10_0.jpg', NULL, 24, 'https://1259476264.vod2.myqcloud.com/fc1b1dadvodgzp1259476264/8d9d5251243791580244704871/f0.mp4');
INSERT INTO `parts` VALUES (41, '01', '101.24', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/e7f7f318243791580235492478/v.f100210.m3u8', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/e7f7f318243791580235492478/coverBySnapshot/coverBySnapshot_10_0.jpg', NULL, 25, 'https://1259476264.vod2.myqcloud.com/fc1b1dadvodgzp1259476264/e7f7f318243791580235492478/f0.mp4');
INSERT INTO `parts` VALUES (42, '02', '101.24', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/fe0dfc33243791580225597270/v.f100210.m3u8', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/fe0dfc33243791580225597270/coverBySnapshot/coverBySnapshot_10_0.jpg', NULL, 25, 'https://1259476264.vod2.myqcloud.com/fc1b1dadvodgzp1259476264/fe0dfc33243791580225597270/f0.mp4');
INSERT INTO `parts` VALUES (43, '01', '78.24', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/3248802a243791580260711931/v.f100210.m3u8', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/3248802a243791580260711931/coverBySnapshot/coverBySnapshot_10_0.jpg', NULL, 27, 'https://1259476264.vod2.myqcloud.com/fc1b1dadvodgzp1259476264/3248802a243791580260711931/f0.mp4');
INSERT INTO `parts` VALUES (44, '02', '102.589', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/5ec777ef243791580216599120/v.f100210.m3u8', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/5ec777ef243791580216599120/coverBySnapshot/coverBySnapshot_10_0.jpg', NULL, 27, 'https://1259476264.vod2.myqcloud.com/fc1b1dadvodgzp1259476264/5ec777ef243791580216599120/f0.mp4');
INSERT INTO `parts` VALUES (45, '03', '90.4', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/580190b0243791580223034697/v.f100210.m3u8', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/580190b0243791580223034697/coverBySnapshot/coverBySnapshot_10_0.jpg', NULL, 27, 'https://1259476264.vod2.myqcloud.com/fc1b1dadvodgzp1259476264/580190b0243791580223034697/f0.mp4');
INSERT INTO `parts` VALUES (46, '01', '98.735', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/32904d08243791580260750710/v.f100210.m3u8', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/32904d08243791580260750710/coverBySnapshot/coverBySnapshot_10_0.jpg', NULL, 26, 'https://1259476264.vod2.myqcloud.com/fc1b1dadvodgzp1259476264/32904d08243791580260750710/f0.mp4');
INSERT INTO `parts` VALUES (47, '02', '104.307', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/f72c51bc243791580266362986/v.f100210.m3u8', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/f72c51bc243791580266362986/coverBySnapshot/coverBySnapshot_10_0.jpg', NULL, 26, 'https://1259476264.vod2.myqcloud.com/fc1b1dadvodgzp1259476264/f72c51bc243791580266362986/f0.mp4');
INSERT INTO `parts` VALUES (48, '03', '91.281', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/5801088a243791580223033791/v.f100210.m3u8', 'https://1259476264.vod2.myqcloud.com/b042c055vodtransgzp1259476264/5801088a243791580223033791/coverBySnapshot/coverBySnapshot_10_0.jpg', NULL, 26, 'https://1259476264.vod2.myqcloud.com/fc1b1dadvodgzp1259476264/5801088a243791580223033791/f0.mp4');

-- ----------------------------
-- Table structure for swiper
-- ----------------------------
DROP TABLE IF EXISTS `swiper`;
CREATE TABLE `swiper`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `video_id` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `REL_7521bb54fcb74f91242f194597`(`video_id` ASC) USING BTREE,
  CONSTRAINT `FK_7521bb54fcb74f91242f1945977` FOREIGN KEY (`video_id`) REFERENCES `video` (`video_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of swiper
-- ----------------------------
INSERT INTO `swiper` VALUES (7, 'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/undefined/bfd3b014-c5aa-4b63-ae65-bda4e5516f91.webp', '以后修仙剧 请以这个作为参考标准！', 20);
INSERT INTO `swiper` VALUES (8, 'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/undefined/0fdfde77-19be-4a99-85f2-2fc18b7cc52f.webp', '昔日小说终成夙愿', 21);
INSERT INTO `swiper` VALUES (10, 'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/undefined/ef2d37d6-125f-40ee-9ef1-2ad03782eb1d.webp', '创意满溢的演出、激情畅快的音乐', 23);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `password` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '邮箱',
  `avatar` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT 'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/default/nologin.png' COMMENT '头像的地址',
  `valiteEmail` tinyint(4) NOT NULL DEFAULT 0 COMMENT '邮箱是否已经通过校验',
  `lastLoginTime` datetime NULL DEFAULT NULL COMMENT '上次登录时间',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`user_id`) USING BTREE,
  UNIQUE INDEX `IDX_78a916df40e02a9deb1c4b75ed`(`username` ASC) USING BTREE,
  UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2`(`email` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'user', '$2a$10$MEQseqyT9PW/KRHDybgXuOzSoP/9OHVTadmygRWf2uc5gIcCEqyGG', 'z.plwvbrp@mhmt.bo', 'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/default/nologin.png', 0, NULL, '2023-02-20 23:06:32.071224', '2023-02-20 23:06:32.071224');
INSERT INTO `user` VALUES (2, 'Edward', '$2a$10$lgFOhe4SllkWQXPsEpCULe2SMTrgH.WXk039Rs0roZC.u7NNCgNUy', 'o.rvlwxglak@vwcgjaj.asia', 'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/default/nologin.png', 0, NULL, '2023-02-22 21:39:25.812021', '2023-02-22 23:49:16.000000');
INSERT INTO `user` VALUES (3, 'Sarah', '$2a$10$GPefE0gcEAE8.M2u0G0usuSctz785W6EIRrIkyaYDiRWyL/2/xr3m', 'g.duhp@lduq.de', 'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/default/nologin.png', 0, NULL, '2023-02-22 21:39:37.431303', '2023-02-22 21:39:37.431303');
INSERT INTO `user` VALUES (4, 'William', '$2a$10$pdcDU7W8tIeb/xsL7XpR6OO1eAR6AT7XbNyKvKtKyNMbJ4EvEV1jC', 'q.kpg@shhyyitxti.do', 'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/undefined/f746c5bd-361f-4bf6-b33f-d783ccec1267.jpeg', 0, NULL, '2023-02-22 21:39:39.308570', '2023-02-23 01:41:57.000000');
INSERT INTO `user` VALUES (5, 'Cynthia', '$2a$10$RcIc78OQkMSX.Wb9S9Pd2eThril6MEpeeQ4dS3Dxkms5fexHpFO9.', 'n.lyjdwuiq@ayukyg.py', 'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/default/nologin.png', 0, NULL, '2023-02-22 21:39:41.120219', '2023-02-22 21:39:41.120219');
INSERT INTO `user` VALUES (6, 'Mark', '$2a$10$Pa1wOlhcSMvHuj2iUHgTYu0hcLXYz8WWqPWw9svZQ618Qrg80GTxq', 'm.xort@vtbeb.nl', 'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/default/nologin.png', 0, NULL, '2023-02-22 21:39:43.273417', '2023-02-22 21:39:43.273417');
INSERT INTO `user` VALUES (7, 'Daniel', '$2a$10$XDFsU/6XizPZ8iSiOzT5iuukDzPeHulHHHzw99TD494H7flfRtZMa', 'b.kysqoolwfp@cwrww.cn', 'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/default/nologin.png', 0, NULL, '2023-02-22 21:39:48.165994', '2023-02-22 21:39:48.165994');
INSERT INTO `user` VALUES (8, 'Frank', '$2a$10$jShq5nFlzBoZ0VeSAinmbO8967Cbo.UwfcjviUX6V3j7krm3fe/v2', 'k.psyeizd@itrh.nf', 'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/default/nologin.png', 0, NULL, '2023-02-22 21:39:50.904999', '2023-02-22 21:39:50.904999');
INSERT INTO `user` VALUES (9, 'Dorothy', '$2a$10$ampMj3Jff3KmgaQWFiU0PuKYjLynUWsZ2Ih9MyNnMTCob2EJA2Yr.', 'o.vigxsx@nxwbv.ls', 'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/default/nologin.png', 0, NULL, '2023-02-22 21:39:53.093385', '2023-02-22 21:39:53.093385');
INSERT INTO `user` VALUES (10, 'Margaret', '$2a$10$BbDhz67JZwo7/ZMHMjgILOtLjVliby8y/8k2lmuwuCPNyvxdOC1xu', 'p.dpvgxt@nupkegsk.sb', 'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/default/nologin.png', 0, NULL, '2023-02-22 21:39:56.838164', '2023-02-22 21:39:56.838164');
INSERT INTO `user` VALUES (11, 'Angela', '$2a$10$jxVEBM8c4C.Gn2CivGOvYux3D2XYZZQ/2ZnUtCjlJaFceCjwnfZDy', 'u.pzfw@qbbrdx.ng', 'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/default/nologin.png', 0, NULL, '2023-02-22 21:40:00.187276', '2023-02-22 21:40:00.187276');
INSERT INTO `user` VALUES (12, 'Richard', '$2a$10$8uUTg3ghKJ1HbfOyajBCYeNdeyWyhEmMyB/m2b9Ota/0yQTQ3RiLm', 'e.sxviw@uxm.gh', 'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/default/nologin.png', 0, NULL, '2023-02-22 21:40:02.734714', '2023-02-22 21:40:02.734714');
INSERT INTO `user` VALUES (13, 'Joseph', '$2a$10$C4PF.nnZATLlLNN/srqpSO4xkRYluUwjg.TDXZerNhQokunj6ajHW', 't.gohlrgl@nuvd.kh', 'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/default/nologin.png', 0, NULL, '2023-02-23 01:15:12.708861', '2023-02-23 01:15:12.708861');
INSERT INTO `user` VALUES (14, '123', '$2a$10$BI3i08YH1PRLDjVi0vh1EepRcR77DqA.LfMjy/1J5xQShVtpE4Pty', '123@123.com', 'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/default/nologin.png', 0, NULL, '2023-02-23 01:22:37.678679', '2023-03-02 20:57:04.254686');
INSERT INTO `user` VALUES (15, '123123', '$2a$10$eEEL4PefBQ22Xks/JDmSIObTZeH7s5b9HbjDnkFIZmdDpFw2XbmKK', '123123@123.com', 'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/undefined/64c1e99e-dee2-45b8-bec8-7d091455f971.gif', 0, NULL, '2023-02-23 01:25:04.526955', '2023-02-23 01:40:16.000000');
INSERT INTO `user` VALUES (16, '123456', '$2a$10$yDPWtEjRt5nYQr8EqUDwb.u5tzJHfZJLjwamdAKvkY76rghk5hGZi', '1233333@123.com', 'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/default/nologin.png', 0, NULL, '2023-03-02 20:41:29.701196', '2023-03-02 20:41:29.701196');

-- ----------------------------
-- Table structure for video
-- ----------------------------
DROP TABLE IF EXISTS `video`;
CREATE TABLE `video`  (
  `video_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '视频标题',
  `introduction` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '剧情简介',
  `other` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '其他介绍',
  `likes` int(11) NOT NULL DEFAULT 0 COMMENT '点赞数',
  `views` int(11) NOT NULL DEFAULT 0 COMMENT '播放量',
  `comments` int(11) NOT NULL DEFAULT 0 COMMENT '评论数',
  `score` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '10' COMMENT '评分',
  `release` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '上映年份',
  `published_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '发布时间/创建视频',
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0 COMMENT '是否删除',
  `cover` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '0' COMMENT '封面',
  PRIMARY KEY (`video_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 28 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of video
-- ----------------------------
INSERT INTO `video` VALUES (20, '凡人修仙传', '看机智的凡人小子韩立如何稳健发展、步步为营，战魔道、夺至宝、驰骋星海、快意恩仇，成为纵横三界的强者。他日仙界重相逢，一声道友尽沧桑。', '初入星海', 0, 0, 0, '10', '2022', '2023-02-24 15:56:01.935774', '2023-02-24 15:56:01.935774', 1, 'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/undefined/e3c25ada-f005-4be7-9e41-c8ebe250acf6.webp');
INSERT INTO `video` VALUES (21, '凡人修仙传 魔道争锋', '在这个守卫灵石矿的副本中，韩立发现了一座有一角破损的古传送阵，一枚大挪移令，两枚血玉蜘蛛的虫卵，以及七八颗五彩的小珠子。当然一些法器和符宝也收获了不少，最典型的就是吕天蒙的那把玉尺符宝，宣乐的黄色顶阶法器遮天钟。', '凡人修仙传 魔道争锋', 0, 0, 0, '10', '2', '2023-02-25 01:43:28.725520', '2023-03-02 22:13:41.000000', 1, 'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/undefined/f1eb991d-5136-472b-8135-d2fd6f11ee00.jpeg');
INSERT INTO `video` VALUES (22, '斗破苍穹', '讲述了天才少年萧炎在创造了家族空前绝后的修炼纪录后突然成了废人，种种打击接踵而至。就在他即将绝望的时候，一缕灵魂从他手上的戒指里浮现，一扇全新的大门在面前开启，经过艰苦修炼最终成就辉煌的故事。\n', '即将上映', 0, 0, 0, '10', '2020', '2023-02-25 01:51:00.570926', '2023-02-25 01:51:00.570926', 1, 'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/undefined/1ba19549-0f50-48c5-aa11-d309857fc0b2.jpeg');
INSERT INTO `video` VALUES (23, '孤独摇滚', '绰号“小孤独”的后藤独，是一个喜爱吉他的孤独少女。经常在家里独自弹奏吉他，但因为一些事情，加入了伊地知虹夏领衔的“纽带乐队”。不敢在他人面前演奏的后藤，能否成为一个出色的乐队成员呢？', '孤独摇滚', 0, 0, 0, '10', '2023', '2023-02-25 01:54:35.706320', '2023-03-02 22:14:00.000000', 1, 'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/undefined/cdf425a6-385b-41ff-96d9-0e9a837a55c9.jpeg');
INSERT INTO `video` VALUES (24, '间谍过家家', '为了潜入名校，西国能力最强的间谍<黄昏>被下令组建家庭.但是，他的“女儿”居然是能够读取他人内心的超能力者！“妻子”是暗杀者？互相隐藏了真实身份的新家庭，面临考验与世界危机的痛快家庭喜剧就此展开！！', '间谍过家家', 0, 0, 0, '10', '2022', '2023-03-03 15:24:24.834873', '2023-03-03 15:24:24.834873', 1, 'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/undefined/a5a31fb9-4bb0-4539-ae3f-915ecb6f6466.webp');
INSERT INTO `video` VALUES (25, '海贼王', '传奇海盗哥尔·D·罗杰在临死前曾留下关于其毕生的财富“One Piece”的消息，由此引得群雄并起，众海盗们为了这笔传说中的巨额财富展开争夺，各种势力、政权不断交替，整个世界进入了动荡混乱的“大海贼时代”。\n\n生长在东海某小村庄的路飞受到海贼香克斯的精神指引，决定成为一名出色的海盗。为了达成这个目标，并找到万众瞩目的One Piece，路飞踏上艰苦的旅程。一路上他遇到了无数磨难，也结识了索隆、娜美、乌索普、香吉、罗宾等一众性格各异的好友。他们携手一同展开充满传奇色彩的大冒险……', '海贼王', 0, 0, 0, '10', '2022', '2023-03-03 16:38:04.069738', '2023-03-03 16:38:04.069738', 1, 'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/undefined/9e4e2f04-6ba4-450b-9f5e-d7cd75d03790.webp');
INSERT INTO `video` VALUES (26, '小林家的龙女仆', '在单身的辛苦OL小林身边突然出现的女仆装束的美少女托尔。长着角和尾巴的她的身姿正是所谓的龙娘。在醉酒的小林邀请下说要到家里去的托尔，鬼使神差地开始以小林家女仆的身份工作……！？“女仆”+“龙”=“女仆龙”有着笨手笨脚的可爱之处！龙娘与人类之间基本上很温暖、偶尔有些黑暗的异种族间交流喜剧！！', '小林家的龙女仆', 0, 0, 0, '10', '2021', '2023-03-03 16:47:43.664206', '2023-03-03 16:47:43.664206', 1, 'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/undefined/08c23789-b86f-4664-a2a4-1d7d93fb8342.jpeg');
INSERT INTO `video` VALUES (27, '瑞克和莫蒂', '天才兼疯子科学家Rick在失踪多年后突然回到女儿Beth的身边，并且在她的车库里搞了一个科学实验室。Rick有一把“传送门枪”，可以穿越到宇宙的各个次元。外孙Morty莫名其妙就成了他的助手，经常被拖进他的自制太空船内，跟他一同开展各种疯狂刺激的宇宙冒险。女儿女婿对他的 疯狂行为感到不满，却又对这个天才科学家无可奈何。', '瑞克和莫蒂', 0, 0, 0, '10', '2022', '2023-03-03 17:09:46.405366', '2023-03-03 17:09:53.000000', 1, 'https://rstv-1259476264.cos.ap-guangzhou.myqcloud.com/undefined/d2e2da5e-5438-47f4-bd26-d37b8964562d.webp');

-- ----------------------------
-- Table structure for video_category_category
-- ----------------------------
DROP TABLE IF EXISTS `video_category_category`;
CREATE TABLE `video_category_category`  (
  `videoVideoId` int(11) NOT NULL,
  `categoryCateId` int(11) NOT NULL,
  PRIMARY KEY (`videoVideoId`, `categoryCateId`) USING BTREE,
  INDEX `IDX_65fc6bcecb73adf4a0203c2678`(`videoVideoId` ASC) USING BTREE,
  INDEX `IDX_41df8cf37fec8c0cf74d4c2809`(`categoryCateId` ASC) USING BTREE,
  CONSTRAINT `FK_41df8cf37fec8c0cf74d4c28096` FOREIGN KEY (`categoryCateId`) REFERENCES `category` (`cate_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_65fc6bcecb73adf4a0203c26788` FOREIGN KEY (`videoVideoId`) REFERENCES `video` (`video_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of video_category_category
-- ----------------------------
INSERT INTO `video_category_category` VALUES (20, 19);
INSERT INTO `video_category_category` VALUES (20, 29);
INSERT INTO `video_category_category` VALUES (21, 19);
INSERT INTO `video_category_category` VALUES (21, 23);
INSERT INTO `video_category_category` VALUES (21, 28);
INSERT INTO `video_category_category` VALUES (22, 19);
INSERT INTO `video_category_category` VALUES (22, 21);
INSERT INTO `video_category_category` VALUES (22, 22);
INSERT INTO `video_category_category` VALUES (22, 23);
INSERT INTO `video_category_category` VALUES (22, 27);
INSERT INTO `video_category_category` VALUES (22, 28);
INSERT INTO `video_category_category` VALUES (23, 18);
INSERT INTO `video_category_category` VALUES (23, 26);
INSERT INTO `video_category_category` VALUES (24, 18);
INSERT INTO `video_category_category` VALUES (24, 27);
INSERT INTO `video_category_category` VALUES (25, 18);
INSERT INTO `video_category_category` VALUES (25, 22);
INSERT INTO `video_category_category` VALUES (25, 27);
INSERT INTO `video_category_category` VALUES (26, 18);
INSERT INTO `video_category_category` VALUES (26, 21);
INSERT INTO `video_category_category` VALUES (26, 22);
INSERT INTO `video_category_category` VALUES (26, 28);
INSERT INTO `video_category_category` VALUES (27, 20);
INSERT INTO `video_category_category` VALUES (27, 21);
INSERT INTO `video_category_category` VALUES (27, 27);

SET FOREIGN_KEY_CHECKS = 1;

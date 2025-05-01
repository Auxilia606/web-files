CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '고유 사용자 ID',
  `login_id` varchar(30) NOT NULL COMMENT '로그인용 사용자 ID',
  `password` varchar(255) NOT NULL COMMENT '암호화된 비밀번호',
  `nickname` varchar(30) NOT NULL COMMENT '사용자 닉네임',
  `role` enum('USER','ADMIN') NOT NULL DEFAULT 'USER' COMMENT '사용자 권한',
  `refresh_token` text COMMENT 'JWT 리프레시 토큰',
  `is_deleted` BOOLEAN DEFAULT FALSE COMMENT '탈퇴 여부',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '가입일시',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '정보 수정일시',
  `last_login_at` datetime DEFAULT NULL COMMENT '마지막 로그인 시간',
  `profile_image_url` varchar(255) DEFAULT NULL COMMENT '프로필 이미지 URL',
  `email_verified` BOOLEAN DEFAULT FALSE COMMENT '이메일 인증 여부 (사용하지 않을 경우 생략 가능)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `login_id` (`login_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
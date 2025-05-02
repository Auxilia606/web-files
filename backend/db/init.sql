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

CREATE TABLE directory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    parent_id BIGINT NULL,  -- 상위 디렉토리 (null이면 최상위)
    directory_name VARCHAR(255) NOT NULL,
    full_path TEXT,               -- 예: /root/project1/docs
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_directory_parent
        FOREIGN KEY (parent_id) REFERENCES directory(id)
        ON DELETE SET NULL
);

CREATE INDEX idx_directory_parent ON directory (parent_id);
CREATE INDEX idx_directory_name ON directory (directory_name);

CREATE TABLE file_info (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    directory_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,       -- 저장된 파일 이름 (서버 내부 이름)
    original_name VARCHAR(255) NOT NULL,   -- 업로드 시 원래 파일 이름
    file_size BIGINT NOT NULL,             -- 바이트 단위 크기
    mime_type VARCHAR(100),
    storage_path TEXT NOT NULL,            -- 서버 내 물리적 경로
    uploader_id BIGINT,                    -- 사용자 ID (외래키 연결 가능)
    view_count INT DEFAULT 0,
    download_count INT DEFAULT 0,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    file_hash CHAR(64),                    -- SHA-256 등으로 중복 파일 식별용 (선택)

    CONSTRAINT fk_file_directory
        FOREIGN KEY (directory_id) REFERENCES directory(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_file_directory ON file_info (directory_id);
CREATE INDEX idx_file_name ON file_info (file_name);
CREATE INDEX idx_file_created_at ON file_info (created_at DESC);
CREATE INDEX idx_file_download_count ON file_info (download_count DESC);

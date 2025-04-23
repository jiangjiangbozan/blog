package com.sullivan.blog.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.vladmihalcea.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Type;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreatedDate
    private LocalDateTime createTime;

    @LastModifiedDate
    private LocalDateTime updateTime;

    @Column(columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean deleted = false;

    @Version
    private Long version;

    @Column(unique = true, nullable = false)
    private String username; // 用户名

    @JsonIgnore
    private String password; // BCrypt加密后的
    private String avatarUrl; // 头像OSS地址
    private String email;

    @Enumerated(EnumType.STRING)
    private UserRole role; // ADMIN/USER

    @Embedded
    private SocialInfo socialInfo; // 嵌套QQ/微信登录信息

    @Type(JsonType.class)
    @Column(columnDefinition = "json")
    private Map<String, Object> features = new HashMap<>();

    @Column(name = "last_login_ip")
    private String lastLoginIp; // 最后登录IP

    @Column(name = "login_count")
    private Integer loginCount = 0; // 登录次数

    @Column(name = "status")
    private Integer status = 0; // 账户状态 0-正常 1-锁定

    // Post.java新增
    @Column(name = "hot_score")
    private Double hotScore = 0.0; // 热度值（用于排序）

    @Column(name = "comment_count")
    private Integer commentCount = 0; // 评论数（冗余字段）
}

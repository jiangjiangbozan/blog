package com.sullivan.blog.entity;

import com.vladmihalcea.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Type;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Data
@Entity
public class Post {
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

    private String title;

    @Lob // 大文本
    private String content; // markdown原始内容

    private String htmlContent; // 渲染后的HTML

    @Column(unique = true)
    private String slug; // SEO优化用伪静态路径

    private Integer viewCount = 0; // 阅读量

    @ManyToMany
    @JoinTable(
            name = "post_tag", // 自定义关联表名
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags; // 标签用关联表

    @ManyToOne
    private Category category; // 分类

    @Type(JsonType.class)
    @Column(columnDefinition = "json")
    private Map<String, Object> attachments = new HashMap<>();
}

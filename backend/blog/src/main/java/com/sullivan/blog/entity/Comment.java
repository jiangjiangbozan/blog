package com.sullivan.blog.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
public class Comment {
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

    @ManyToOne
    private Post post; // 所属文章
    @ManyToOne
    private User author; // 评论人

    @ManyToOne
    private Comment parent; // 父评论

    @OneToMany(mappedBy = "parent")
    private List<Comment> replies; // 子评论
    private Boolean is_admin_replied = false;
}

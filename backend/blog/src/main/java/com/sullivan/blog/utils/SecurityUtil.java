package com.sullivan.blog.utils;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

/**
 * SecurityUtil
 *
 * <p>
 * 用于获取当前登录的用户名
 *
 * @author jiang
 **/
public class SecurityUtil {

    private SecurityUtil() {
        throw new IllegalStateException("Cannot create instance of static util class");
    }

    /**
     * 从上下文中获取当前登录的用户信息
     */
    public static Optional<String> getCurrentUserLogin() {
        // 获取上下文对象
        SecurityContext context = SecurityContextHolder.getContext();
        // 获取验证信息
        Authentication authentication = context.getAuthentication();
        // 返回上下文中的用户信息
        return Optional.ofNullable(authentication)
                .map(auth -> {
                    if (auth.getPrincipal() instanceof UserDetails userDetails) {

                        return userDetails.getUsername();
                    } else if (auth.getPrincipal() instanceof String) {
                        return (String) auth.getPrincipal();
                    }
                    return null;
                });

    }

}

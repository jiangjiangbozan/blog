package com.sullivan.blog.utils;

import com.sullivan.blog.config.JwtConfigProperties;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {
    private final SecretKey secretKey;
    private final long expirationHours;

    // 从配置读取密钥
    public JwtUtil(JwtConfigProperties jwtConfigProperties) {
        this.secretKey = Keys.hmacShaKeyFor(jwtConfigProperties.getSecret().getBytes(StandardCharsets.UTF_8));
        this.expirationHours = jwtConfigProperties.getExpirationHours();
    }

    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuer("sullivan-blog")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationHours * 3600_000))
                .signWith(secretKey)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}

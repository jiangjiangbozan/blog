package com.sullivan.blog.controller;

import com.sullivan.blog.service.JwtAuthService;
import com.sullivan.blog.utils.SecurityUtil;
import lombok.Data;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtAuthService authService;

    public AuthController(JwtAuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest request) {
        String token = authService.login(request.getUsername(), request.getPassword());
        return Map.of("token", token);
    }

    @GetMapping("/me")
    public Map<String, String> currentUser() {
        String username = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new IllegalStateException("用户未登录"));
        return Map.of("username", username);
    }

    @Data
    static class LoginRequest {
        private String username;
        private String password;
    }
}

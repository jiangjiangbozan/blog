package com.sullivan.blog.dto;

import lombok.Data;

public class AuthDto {
    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @Data
    public static class RegisterRequest {
        private String username;
        private String email;
        private String password;
    }
}

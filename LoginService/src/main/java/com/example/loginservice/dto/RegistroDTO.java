package com.example.loginservice.dto;
public class RegistroDTO {
    private String nickname;
    private String password;
    // Considera incluir más campos según tu modelo de Usuario

    // Getters y setters
    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}


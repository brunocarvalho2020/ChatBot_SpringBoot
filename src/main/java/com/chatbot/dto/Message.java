package com.chatbot.dto;

public class Message {
    private String message;
    private String user_id; // Mantive snake_case para bater com o JSON
    private boolean is_anonymous;

    // Construtores
    public Message() {}

    public Message(String message, String user_id, boolean is_anonymous) {
        this.message = message;
        this.user_id = user_id;
        this.is_anonymous = is_anonymous;
    }

    // Getters e Setters (ajustados para o padrão JavaBean)
    public String getMessage() {
        return message;
    }

    // Importante: o getter para user_id deve ser getUser_id()
    public String getUser_id() {
        return user_id;
    }

    // Para campos boolean, o padrão é isNomeCampo()
    public boolean isIs_anonymous() {
        return is_anonymous;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public void setIs_anonymous(boolean is_anonymous) {
        this.is_anonymous = is_anonymous;
    }

    // Método toString para debug
    @Override
    public String toString() {
        return "Message{" +
                "message='" + message + '\'' +
                ", user_id='" + user_id + '\'' +
                ", is_anonymous=" + is_anonymous +
                '}';
    }
}
package com.chatbot.controller;

import com.chatbot.dto.Message;
import com.chatbot.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {
    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    @Autowired
    private MessageService messageService;

    @PostMapping
    public Message handleChat(@RequestBody Message request) {
        logger.info("\nDados recebidos - UserID: {}, Mensagem: {}, Anônimo: {}", 
        request.getUser_id(), 
        request.getMessage(), 
        request.isIs_anonymous());
        String response = messageService.processMessage(request.getMessage().toLowerCase());
        return new Message(response, request.getUser_id(), request.isIs_anonymous());
    }
}

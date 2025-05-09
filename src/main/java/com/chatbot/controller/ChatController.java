package com.chatbot.controller;

import com.chatbot.dto.Message;
import com.chatbot.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private MessageService messageService;

    @PostMapping
    public Message handleChat(@RequestBody Message message) {
        String response = messageService.processMessage(message.getMessage().toLowerCase());
        return new Message(response);
    }
}

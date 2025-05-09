package com.chatbot.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class MessageService {

    private final Map<String, ResponseCategory> responseCategories;
    private final List<String> defaultResponses;

    public MessageService() {
        responseCategories = new HashMap<>();

        // Categorias e respostas
        responseCategories.put("saudacoes", new ResponseCategory(
                Arrays.asList("oi", "olá", "ola", "eae", "e aí", "bom dia", "boa tarde", "boa noite"),
                "Olá! Bem-vindo à Loja XYZ. Como posso ajudar você hoje?"
        ));

        responseCategories.put("precos", new ResponseCategory(
                Arrays.asList("preço", "preco", "valor", "custo", "quanto custa", "quanto é", "valor do"),
                "Nossos preços variam conforme o produto. Você quer saber sobre alguma categoria específica?"
        ));

        responseCategories.put("pagamentos", new ResponseCategory(
                Arrays.asList("pagamento", "cartão", "cartao", "pix", "boleto", "parcelado", "parcela", "à vista"),
                "Aceitamos pagamento via cartão (crédito/débito), PIX com 5% de desconto, boleto bancário e transferência bancária."
        ));

        responseCategories.put("frete", new ResponseCategory(
                Arrays.asList("frete", "entrega", "envio", "prazo de entrega", "tempo de entrega", "delivery"),
                "Opções de entrega:\n- Retirada na loja: grátis\n- Entrega padrão: 3-5 dias úteis (R$ 15,00)\n- Expressa: 1-2 dias úteis (R$ 30,00)"
        ));

        responseCategories.put("promocoes", new ResponseCategory(
                Arrays.asList("promoção", "promocao", "desconto", "oferta", "black friday", "natal", "dia das mães"),
                "Promoções atuais:\n- Eletrônicos: 15% off no PIX\n- Roupas: 2ª peça com 50% off\n- Compras acima de R$ 500 têm frete grátis!"
        ));

        responseCategories.put("horario", new ResponseCategory(
                Arrays.asList("horário", "horario", "funcionamento", "aberto", "fechado", "atende"),
                "Nosso horário de atendimento:\n- Segunda a sexta: 9h às 18h\n- Sábados: 9h às 13h\n- Domingos e feriados: fechado."
        ));

        responseCategories.put("local", new ResponseCategory(
                Arrays.asList("endereço", "endereco", "localização", "localizacao", "onde fica", "filial"),
                "Nossa loja está localizada em Rua Principal, 123 - Centro, São Paulo/SP. Também temos uma loja online!"
        ));

        responseCategories.put("contato", new ResponseCategory(
                Arrays.asList("contato", "telefone", "email", "whatsapp", "falar com atendente", "sac"),
                "Contatos da loja:\n- Telefone: (11) 1234-5678\n- WhatsApp: (11) 98765-4321\n- Email: contato@lojaxyz.com.br"
        ));

        responseCategories.put("devolucao", new ResponseCategory(
                Arrays.asList("devolução", "devolucao", "troca", "arrependimento", "garantia"),
                "Política de devolução:\n- Prazo: 7 dias corridos após recebimento\n- Condições: Produto intacto com nota fiscal\n- Garantia de 12 meses para defeitos de fábrica."
        ));

        // Respostas padrão para quando não entende a pergunta
        defaultResponses = Arrays.asList(
                "Desculpe, não entendi completamente. Você pode reformular?",
                "Poderia especificar melhor sua dúvida?",
                "Sobre qual destes assuntos você quer saber?\n- Preços e promoções\n- Formas de pagamento\n- Prazos de entrega\n- Horário de atendimento\n- Localização da loja"
        );
    }

    public String processMessage(String input) {
        if (input == null || input.trim().isEmpty()) {
            return "Desculpe, não entendi sua mensagem. Poderia reformular?";
        }

        input = input.toLowerCase().trim();

        // Verifica cada categoria e responde se encontrar correspondência
        for (ResponseCategory category : responseCategories.values()) {
            if (category.matches(input)) {
                return category.getResponse();
            }
        }

        // Se não encontrar correspondência, retorna uma resposta aleatória de erro
        return defaultResponses.get(new Random().nextInt(defaultResponses.size()));
    }

    // Classe interna para estruturar as categorias
    private static class ResponseCategory {
        private final List<String> keywords;
        private final String response;

        public ResponseCategory(List<String> keywords, String response) {
            this.keywords = keywords;
            this.response = response;
        }

        public boolean matches(String input) {
            return keywords.stream().anyMatch(input::contains);
        }

        public String getResponse() {
            return response;
        }
    }
}

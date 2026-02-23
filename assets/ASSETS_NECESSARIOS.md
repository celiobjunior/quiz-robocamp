# ASSETS_NECESSARIOS

Este arquivo lista os assets visuais que você pode fornecer para substituir placeholders no quiz.

## Pasta recomendada
Use a pasta: `src/assets/sensors/`

## Arquivos necessários

### 1) `sensor-ultrassonico-hc-sr04.png`
- Pergunta relacionada: `e02`
- Texto da pergunta: sensor para medir distância em robôs móveis
- Resolução recomendada: `1280x720`
- Formato recomendado: `.png` (ou `.webp`)
- Regra de enquadramento: objeto centralizado, fundo neutro, boa nitidez nos dois transdutores

### 2) `circuito-led-resistor.png`
- Pergunta relacionada: `e03`
- Texto da pergunta: função do resistor em série com LED
- Resolução recomendada: `1280x720`
- Formato recomendado: `.png` (ou `.webp`)
- Regra de enquadramento: circuito visível por completo (fonte, resistor e LED), sem cortes

### 3) `circuito-pullup-botao.png`
- Pergunta relacionada: `d02`
- Texto da pergunta: uso de resistor pull-up/pull-down para entrada digital
- Resolução recomendada: `1280x720`
- Formato recomendado: `.png` (ou `.webp`)
- Regra de enquadramento: botão, resistor e conexão ao pino digital visíveis e identificáveis

## Como substituir no projeto
1. Adicione os arquivos finais em `src/assets/sensors/`.
2. Atualize o mapa em `src/utils/images.ts` para apontar para os novos imports.
3. Em `src/data/questions.pt-BR.json`, altere `placeholder` para `false` nas perguntas que receberam imagem final.

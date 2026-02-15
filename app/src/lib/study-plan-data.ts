import { TopicFormData } from '@/types';
import { BloomLevel, LearningObjective } from '@/types/topic';

export interface PetrobrasPlanTopic extends TopicFormData {
    month: number;
    week: number;
}

export interface DefaultLearningObjective {
    description: string;
    bloomLevel: BloomLevel;
}

export interface TopicWithObjectives extends PetrobrasPlanTopic {
    objectives?: DefaultLearningObjective[];
}

export const PETROBRAS_STUDY_PLAN: PetrobrasPlanTopic[] = [
    // Mês 1: A Base da Língua
    {
        name: 'Fonética e Acentuação',
        description: 'Diferença entre letra e fonema; Encontros Vocálicos (Ditongo, Tritongo, Hiato); Encontros Consonantais e Dígrafos.',
        category: 'gramatica',
        priority: 'alta',
        targetHours: 4,
        month: 1,
        week: 1
    },
    {
        name: 'Separação Silábica',
        description: 'Regras básicas e translineação (dígrafo e encontros consonantais).',
        category: 'gramatica',
        priority: 'media',
        targetHours: 2,
        month: 1,
        week: 1
    },
    {
        name: 'Acentuação Gráfica',
        description: 'Oxítonas, Paroxítonas, Proparoxítonas; Acentos diferenciais e regras de hiato.',
        category: 'gramatica',
        priority: 'alta',
        targetHours: 4,
        month: 1,
        week: 1
    },
    {
        name: 'Ortografia Oficial',
        description: 'Uso de X/CH, S/Z, G/J; Uso do Hífen; Uso dos "Porquês".',
        category: 'gramatica',
        priority: 'alta',
        targetHours: 4,
        month: 1,
        week: 2
    },
    {
        name: 'Estrutura e Formação das Palavras',
        description: 'Radical, Vogal Temática, Desinências; Derivação e Composição.',
        category: 'gramatica',
        priority: 'media',
        targetHours: 3,
        month: 1,
        week: 2
    },
    {
        name: 'Semântica',
        description: 'Sinônimos, Antônimos, Homônimos e Parônimos.',
        category: 'vocabulario',
        priority: 'alta',
        targetHours: 3,
        month: 1,
        week: 2
    },
    {
        name: 'Substantivos',
        description: 'Classificação; Flexão de Gênero e Número (atenção ao plural dos compostos).',
        category: 'gramatica',
        priority: 'alta',
        targetHours: 4,
        month: 1,
        week: 3
    },
    {
        name: 'Artigos e Numerais',
        description: 'Emprego e classificação.',
        category: 'gramatica',
        priority: 'baixa',
        targetHours: 2,
        month: 1,
        week: 3
    },
    {
        name: 'Adjetivos',
        description: 'Pátrios, Locuções Adjetivas, Flexão e Graus.',
        category: 'gramatica',
        priority: 'media',
        targetHours: 4,
        month: 1,
        week: 3
    },
    {
        name: 'Pronomes Pessoais',
        description: 'Retos, Oblíquos e Tratamento (Decreto 9.758/2019).',
        category: 'gramatica',
        priority: 'alta',
        targetHours: 4,
        month: 1,
        week: 4
    },
    {
        name: 'Pronomes Possessivos/Demonstrativos',
        description: 'Uso para coesão textual (anáfora/catáfora).',
        category: 'gramatica',
        priority: 'alta',
        targetHours: 3,
        month: 1,
        week: 4
    },
    {
        name: 'Pronomes Relativos',
        description: 'O uso de que, quem, cujo, onde (essencial para sintaxe).',
        category: 'gramatica',
        priority: 'alta',
        targetHours: 4,
        month: 1,
        week: 4
    },

    // Mês 2: O Motor da Frase
    {
        name: 'Verbos - Estrutura e Tempos',
        description: 'Modos, Tempos simples e compostos, Correlação verbal.',
        category: 'gramatica',
        priority: 'alta',
        targetHours: 6,
        month: 2,
        week: 5
    },
    {
        name: 'Classificação Verbal',
        description: 'Regulares, Irregulares, Defectivos; Foco em particípios duplos.',
        category: 'gramatica',
        priority: 'media',
        targetHours: 4,
        month: 2,
        week: 5
    },
    {
        name: 'Sintaxe da Oração - Termos Essenciais',
        description: 'Sujeito (Tipos) e Predicado.',
        category: 'gramatica',
        priority: 'alta',
        targetHours: 4,
        month: 2,
        week: 6
    },
    {
        name: 'Predicação Verbal',
        description: 'Transitividade (VTD, VTI, VTDI) e Verbos de Ligação.',
        category: 'gramatica',
        priority: 'alta',
        targetHours: 4,
        month: 2,
        week: 6
    },
    {
        name: 'Vozes Verbais',
        description: 'Ativa, Passiva e Reflexiva; Conversão.',
        category: 'gramatica',
        priority: 'media',
        targetHours: 3,
        month: 2,
        week: 6
    },
    {
        name: 'Complementos Verbais',
        description: 'Objeto Direto, Indireto, Preposicionado e Pleonástico.',
        category: 'gramatica',
        priority: 'alta',
        targetHours: 4,
        month: 2,
        week: 7
    },
    {
        name: 'Termos Acessórios e Complemento Nominal',
        description: 'Adjunto Adnominal vs. Complemento Nominal; Adjunto Adverbial; Aposto e Vocativo.',
        category: 'gramatica',
        priority: 'alta',
        targetHours: 4,
        month: 2,
        week: 7
    },
    {
        name: 'Colocação Pronominal',
        description: 'Próclise, Mesóclise e Ênclise (regras de atração).',
        category: 'gramatica',
        priority: 'alta',
        targetHours: 3,
        month: 2,
        week: 7
    },
    {
        name: 'Período Composto - Coordenação',
        description: 'Orações Coordenadas Sindéticas e Assindéticas.',
        category: 'gramatica',
        priority: 'alta',
        targetHours: 4,
        month: 2,
        week: 8
    },
    {
        name: 'Subordinação Substantiva e Adjetiva',
        description: 'Orações Substantivas e Adjetivas (foco na vírgula).',
        category: 'gramatica',
        priority: 'alta',
        targetHours: 4,
        month: 2,
        week: 8
    },
    {
        name: 'Subordinação Adverbial',
        description: 'Causais, Consecutivas, Condicionais, Concessivas, etc.',
        category: 'gramatica',
        priority: 'alta',
        targetHours: 4,
        month: 2,
        week: 8
    },

    // Mês 3: Refinamento e Aplicação
    {
        name: 'Concordância Nominal',
        description: 'Regras gerais e casos especiais (anexo, bastante, meio).',
        category: 'gramatica',
        priority: 'alta',
        targetHours: 4,
        month: 3,
        week: 9
    },
    {
        name: 'Concordância Verbal',
        description: 'Verbos impessoais, partícula "se", expressões partitivas.',
        category: 'gramatica',
        priority: 'alta',
        targetHours: 6,
        month: 3,
        week: 9
    },
    {
        name: 'Regência Verbal e Nominal',
        description: 'Verbos que mudam de sentido; Preposições exigidas por nomes.',
        category: 'gramatica',
        priority: 'alta',
        targetHours: 5,
        month: 3,
        week: 10
    },
    {
        name: 'Crase',
        description: 'Regras proibitivas, obrigatórias e facultativas.',
        category: 'gramatica',
        priority: 'alta',
        targetHours: 5,
        month: 3,
        week: 10
    },
    {
        name: 'Pontuação',
        description: 'Uso da vírgula e ponto e vírgula.',
        category: 'gramatica',
        priority: 'alta',
        targetHours: 5,
        month: 3,
        week: 11
    },
    {
        name: 'Figuras de Linguagem',
        description: 'Palavras, Pensamento, Sintaxe e Som.',
        category: 'literatura',
        priority: 'media',
        targetHours: 3,
        month: 3,
        week: 11
    },
    {
        name: 'Interpretação e Compreensão de Texto',
        description: 'Inferências; Conotativo vs. Denotativo; Tipologia Textual.',
        category: 'interpretacao',
        priority: 'alta',
        targetHours: 6,
        month: 3,
        week: 12
    },
    {
        name: 'Redação Oficial',
        description: 'Manual da Presidência e Decreto 9.758/2019.',
        category: 'redacao',
        priority: 'media',
        targetHours: 3,
        month: 3,
        week: 12
    },
    {
        name: 'Variação Linguística',
        description: 'Histórica, regional e social; Níveis de linguagem.',
        category: 'interpretacao',
        priority: 'baixa',
        targetHours: 2,
        month: 3,
        week: 12
    }
];

// Default Learning Objectives per Topic based on Bloom's Taxonomy
export const DEFAULT_LEARNING_OBJECTIVES: Record<string, DefaultLearningObjective[]> = {
    'Fonética e Acentuação': [
        { description: 'Definir a diferença entre letra e fonema', bloomLevel: 'remember' },
        { description: 'Identificar e classificar encontros vocálicos (ditongo, tritongo, hiato)', bloomLevel: 'understand' },
        { description: 'Reconhecer encontros consonantais e dígrafos em palavras', bloomLevel: 'apply' },
        { description: 'Analisar palavras quanto à estrutura silábica', bloomLevel: 'analyze' }
    ],
    'Separação Silábica': [
        { description: 'Recordar as regras básicas de separação silábica', bloomLevel: 'remember' },
        { description: 'Aplicar regras de translineação corretamente', bloomLevel: 'apply' },
        { description: 'Separar corretamente palavras com dígrafos e encontros consonantais', bloomLevel: 'apply' }
    ],
    'Acentuação Gráfica': [
        { description: 'Classificar palavras quanto à tonicidade (oxítonas, paroxítonas, proparoxítonas)', bloomLevel: 'understand' },
        { description: 'Aplicar as regras de acentuação para cada tipo de palavra', bloomLevel: 'apply' },
        { description: 'Identificar acentos diferenciais e suas funções', bloomLevel: 'analyze' },
        { description: 'Resolver questões de acentuação envolvendo regras de hiato', bloomLevel: 'evaluate' }
    ],
    'Ortografia Oficial': [
        { description: 'Memorizar o uso correto de X/CH, S/Z, G/J', bloomLevel: 'remember' },
        { description: 'Aplicar corretamente o uso do hífen após o novo acordo', bloomLevel: 'apply' },
        { description: 'Diferenciar os "porquês" em contextos variados', bloomLevel: 'analyze' },
        { description: 'Produzir textos com ortografia correta', bloomLevel: 'create' }
    ],
    'Estrutura e Formação das Palavras': [
        { description: 'Identificar radical, vogal temática e desinências', bloomLevel: 'remember' },
        { description: 'Explicar processos de derivação e composição', bloomLevel: 'understand' },
        { description: 'Analisar a estrutura de palavras complexas', bloomLevel: 'analyze' },
        { description: 'Criar novas palavras usando processos de derivação', bloomLevel: 'create' }
    ],
    'Semântica': [
        { description: 'Definir sinônimos, antônimos, homônimos e parônimos', bloomLevel: 'remember' },
        { description: 'Identificar relações semânticas entre palavras', bloomLevel: 'understand' },
        { description: 'Aplicar conhecimento semântico na interpretação de textos', bloomLevel: 'apply' },
        { description: 'Avaliar o uso adequado de sinônimos em diferentes contextos', bloomLevel: 'evaluate' }
    ],
    'Substantivos': [
        { description: 'Classificar substantivos quanto à espécie, gênero e número', bloomLevel: 'understand' },
        { description: 'Aplicar regras de flexão de gênero corretamente', bloomLevel: 'apply' },
        { description: 'Formar o plural de substantivos compostos', bloomLevel: 'apply' },
        { description: 'Analisar casos especiais de plural', bloomLevel: 'analyze' }
    ],
    'Artigos e Numerais': [
        { description: 'Identificar e classificar artigos e numerais', bloomLevel: 'remember' },
        { description: 'Aplicar corretamente o uso de artigos em frases', bloomLevel: 'apply' },
        { description: 'Escrever por extenso numerais cardinais e ordinais', bloomLevel: 'apply' }
    ],
    'Adjetivos': [
        { description: 'Reconhecer adjetivos pátrios e locuções adjetivas', bloomLevel: 'remember' },
        { description: 'Aplicar regras de flexão de adjetivos', bloomLevel: 'apply' },
        { description: 'Usar corretamente os graus do adjetivo', bloomLevel: 'apply' },
        { description: 'Avaliar o uso adequado de adjetivos para coesão textual', bloomLevel: 'evaluate' }
    ],
    'Pronomes Pessoais': [
        { description: 'Identificar pronomes pessoais retos e oblíquos', bloomLevel: 'remember' },
        { description: 'Diferenciar pronomes de tratamento conforme o Decreto 9.758/2019', bloomLevel: 'understand' },
        { description: 'Aplicar corretamente pronomes oblíquos átonos e tônicos', bloomLevel: 'apply' },
        { description: 'Analisar a função sintática dos pronomes pessoais', bloomLevel: 'analyze' }
    ],
    'Pronomes Possessivos/Demonstrativos': [
        { description: 'Identificar pronomes possessivos e demonstrativos', bloomLevel: 'remember' },
        { description: 'Explicar o uso de pronomes demonstrativos na coesão textual', bloomLevel: 'understand' },
        { description: 'Aplicar pronomes para estabelecer anáfora e catáfora', bloomLevel: 'apply' },
        { description: 'Avaliar a adequação do uso de possessivos em textos', bloomLevel: 'evaluate' }
    ],
    'Pronomes Relativos': [
        { description: 'Listar os pronomes relativos e suas funções', bloomLevel: 'remember' },
        { description: 'Explicar o uso de que, quem, cujo, onde', bloomLevel: 'understand' },
        { description: 'Aplicar pronomes relativos na construção de orações subordinadas', bloomLevel: 'apply' },
        { description: 'Analisar a função sintática dos pronomes relativos', bloomLevel: 'analyze' }
    ],
    'Verbos - Estrutura e Tempos': [
        { description: 'Identificar modos e tempos verbais', bloomLevel: 'remember' },
        { description: 'Diferenciar tempos simples e compostos', bloomLevel: 'understand' },
        { description: 'Aplicar corretamente a correlação verbal em textos', bloomLevel: 'apply' },
        { description: 'Analisar o valor semântico dos tempos verbais', bloomLevel: 'analyze' },
        { description: 'Avaliar a adequação dos tempos verbais em diferentes contextos', bloomLevel: 'evaluate' }
    ],
    'Classificação Verbal': [
        { description: 'Classificar verbos como regulares, irregulares e defectivos', bloomLevel: 'understand' },
        { description: 'Identificar particípios duplos e seu uso', bloomLevel: 'apply' },
        { description: 'Conjugar verbos irregulares frequentes', bloomLevel: 'apply' },
        { description: 'Analisar a regularidade de verbos desconhecidos', bloomLevel: 'analyze' }
    ],
    'Sintaxe da Oração - Termos Essenciais': [
        { description: 'Identificar sujeito e predicado em orações', bloomLevel: 'remember' },
        { description: 'Classificar tipos de sujeito', bloomLevel: 'understand' },
        { description: 'Analisar a estrutura do predicado', bloomLevel: 'analyze' },
        { description: 'Identificar sujeito em orações complexas', bloomLevel: 'analyze' }
    ],
    'Predicação Verbal': [
        { description: 'Diferenciar verbos transitivos, intransitivos e de ligação', bloomLevel: 'understand' },
        { description: 'Classificar verbos quanto à transitividade (VTD, VTI, VTDI)', bloomLevel: 'apply' },
        { description: 'Analisar a predicação verbal em contextos variados', bloomLevel: 'analyze' },
        { description: 'Avaliar mudanças de sentido conforme a predicação', bloomLevel: 'evaluate' }
    ],
    'Vozes Verbais': [
        { description: 'Identificar voz ativa, passiva e reflexiva', bloomLevel: 'remember' },
        { description: 'Converter frases entre vozes verbais', bloomLevel: 'apply' },
        { description: 'Analisar o efeito de sentido das vozes verbais', bloomLevel: 'analyze' },
        { description: 'Avaliar a adequação da voz verbal em textos', bloomLevel: 'evaluate' }
    ],
    'Complementos Verbais': [
        { description: 'Identificar objeto direto e indireto', bloomLevel: 'remember' },
        { description: 'Diferenciar objeto direto preposicionado de objeto indireto', bloomLevel: 'understand' },
        { description: 'Aplicar corretamente complementos verbais', bloomLevel: 'apply' },
        { description: 'Analisar objetos pleonásticos', bloomLevel: 'analyze' }
    ],
    'Termos Acessórios e Complemento Nominal': [
        { description: 'Diferenciar adjunto adnominal de complemento nominal', bloomLevel: 'understand' },
        { description: 'Identificar adjuntos adverbiais', bloomLevel: 'remember' },
        { description: 'Aplicar conhecimento sobre aposto e vocativo', bloomLevel: 'apply' },
        { description: 'Analisar a função de termos acessórios na coesão textual', bloomLevel: 'analyze' }
    ],
    'Colocação Pronominal': [
        { description: 'Definir próclise, mesóclise e ênclise', bloomLevel: 'remember' },
        { description: 'Identificar palavras atrativas para próclise', bloomLevel: 'understand' },
        { description: 'Aplicar regras de colocação pronominal corretamente', bloomLevel: 'apply' },
        { description: 'Avaliar a correção da colocação pronominal em frases', bloomLevel: 'evaluate' }
    ],
    'Período Composto - Coordenação': [
        { description: 'Identificar orações coordenadas sindéticas e assindéticas', bloomLevel: 'remember' },
        { description: 'Classificar orações coordenadas quanto ao valor semântico', bloomLevel: 'understand' },
        { description: 'Aplicar pontuação correta em períodos compostos por coordenação', bloomLevel: 'apply' },
        { description: 'Analisar o valor lógico das conjunções coordenativas', bloomLevel: 'analyze' }
    ],
    'Subordinação Substantiva e Adjetiva': [
        { description: 'Identificar orações subordinadas substantivas', bloomLevel: 'remember' },
        { description: 'Classificar orações subordinadas adjetivas', bloomLevel: 'understand' },
        { description: 'Diferenciar orações adjetivas restritivas e explicativas', bloomLevel: 'analyze' },
        { description: 'Aplicar pontuação correta em orações adjetivas', bloomLevel: 'apply' }
    ],
    'Subordinação Adverbial': [
        { description: 'Identificar orações subordinadas adverbiais', bloomLevel: 'remember' },
        { description: 'Classificar orações causais, consecutivas, condicionais, concessivas', bloomLevel: 'understand' },
        { description: 'Aplicar conjunções subordinativas adequadas', bloomLevel: 'apply' },
        { description: 'Analisar relações lógicas estabelecidas por orações adverbiais', bloomLevel: 'analyze' }
    ],
    'Concordância Nominal': [
        { description: 'Recordar regras gerais de concordância nominal', bloomLevel: 'remember' },
        { description: 'Aplicar regras de concordância em casos especiais', bloomLevel: 'apply' },
        { description: 'Analisar concordância com palavras como anexo, bastante, meio', bloomLevel: 'analyze' },
        { description: 'Avaliar a correção de frases quanto à concordância nominal', bloomLevel: 'evaluate' }
    ],
    'Concordância Verbal': [
        { description: 'Recordar regras gerais de concordância verbal', bloomLevel: 'remember' },
        { description: 'Aplicar concordância com verbos impessoais', bloomLevel: 'apply' },
        { description: 'Analisar concordância com partícula "se" e expressões partitivas', bloomLevel: 'analyze' },
        { description: 'Avaliar a correção de frases quanto à concordância verbal', bloomLevel: 'evaluate' },
        { description: 'Criar frases com concordância verbal correta em casos complexos', bloomLevel: 'create' }
    ],
    'Regência Verbal e Nominal': [
        { description: 'Identificar a regência de verbos frequentes', bloomLevel: 'remember' },
        { description: 'Explicar mudanças de sentido conforme a regência verbal', bloomLevel: 'understand' },
        { description: 'Aplicar preposições corretas exigidas por verbos e nomes', bloomLevel: 'apply' },
        { description: 'Analisar a regência em contextos variados', bloomLevel: 'analyze' },
        { description: 'Avaliar a correção de frases quanto à regência', bloomLevel: 'evaluate' }
    ],
    'Crase': [
        { description: 'Identificar situações de uso obrigatório de crase', bloomLevel: 'remember' },
        { description: 'Diferenciar situações proibitivas, obrigatórias e facultativas', bloomLevel: 'understand' },
        { description: 'Aplicar crase corretamente em frases', bloomLevel: 'apply' },
        { description: 'Analisar o uso de crase com pronomes e locuções', bloomLevel: 'analyze' },
        { description: 'Avaliar a correção do uso de crase em textos', bloomLevel: 'evaluate' }
    ],
    'Pontuação': [
        { description: 'Identificar usos corretos da vírgula', bloomLevel: 'remember' },
        { description: 'Explicar o uso do ponto e vírgula', bloomLevel: 'understand' },
        { description: 'Aplicar pontuação correta em períodos compostos', bloomLevel: 'apply' },
        { description: 'Analisar o efeito de sentido da pontuação', bloomLevel: 'analyze' },
        { description: 'Criar textos com pontuação adequada', bloomLevel: 'create' }
    ],
    'Figuras de Linguagem': [
        { description: 'Identificar figuras de linguagem (palavras, pensamento, sintaxe, som)', bloomLevel: 'remember' },
        { description: 'Explicar o efeito de sentido das figuras de linguagem', bloomLevel: 'understand' },
        { description: 'Identificar figuras em textos literários e publicitários', bloomLevel: 'apply' },
        { description: 'Analisar o papel das figuras na construção do sentido', bloomLevel: 'analyze' }
    ],
    'Interpretação e Compreensão de Texto': [
        { description: 'Identificar ideia central e ideias secundárias', bloomLevel: 'remember' },
        { description: 'Fazer inferências a partir do texto', bloomLevel: 'apply' },
        { description: 'Diferenciar sentido conotativo e denotativo', bloomLevel: 'understand' },
        { description: 'Analisar tipologia textual e gêneros', bloomLevel: 'analyze' },
        { description: 'Avaliar a coerência e coesão de textos', bloomLevel: 'evaluate' },
        { description: 'Produzir resumos e sínteses de textos', bloomLevel: 'create' }
    ],
    'Redação Oficial': [
        { description: 'Identificar características da redação oficial', bloomLevel: 'remember' },
        { description: 'Explicar as alterações do Decreto 9.758/2019', bloomLevel: 'understand' },
        { description: 'Aplicar padrões de redação oficial em documentos', bloomLevel: 'apply' },
        { description: 'Elaborar textos conforme o Manual da Presidência', bloomLevel: 'create' }
    ],
    'Variação Linguística': [
        { description: 'Identificar tipos de variação linguística', bloomLevel: 'remember' },
        { description: 'Explicar variação histórica, regional e social', bloomLevel: 'understand' },
        { description: 'Analisar níveis de linguagem em diferentes contextos', bloomLevel: 'analyze' },
        { description: 'Avaliar a adequação da linguagem ao contexto', bloomLevel: 'evaluate' }
    ]
};

// Helper function to get objectives for a topic
export function getDefaultObjectivesForTopic(topicName: string): DefaultLearningObjective[] {
    return DEFAULT_LEARNING_OBJECTIVES[topicName] || [];
}

// Helper function to create a full objective from default
export function createObjectiveFromDefault(
    topicId: string,
    defaultObjective: DefaultLearningObjective
): Omit<LearningObjective, 'id' | 'createdAt' | 'updatedAt'> {
    return {
        topicId,
        description: defaultObjective.description,
        bloomLevel: defaultObjective.bloomLevel,
        completed: false
    };
}

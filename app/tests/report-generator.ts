import * as fs from 'fs';
import * as path from 'path';

interface TestResult {
    section: string;
    setting: string;
    status: 'PASS' | 'FAIL';
    duration: number;
    error?: string;
    observation?: string;
}

function generateReport() {
    const resultsPath = path.join(process.cwd(), 'tests', 'results.json');
    if (!fs.existsSync(resultsPath)) {
        console.error('Results file not found!');
        return;
    }

    const results: TestResult[] = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
    const totalTests = results.length;
    const passedTests = results.filter(r => r.status === 'PASS').length;
    const failedTests = totalTests - passedTests;

    let report = `# Relatório de Testes – Robô de Configurações\n\n`;
    report += `## Resumo Executivo\n\n`;
    report += `- **Total de Testes:** ${totalTests}\n`;
    report += `- **Aprovados:** ${passedTests}\n`;
    report += `- **Reprovados:** ${failedTests}\n`;
    report += `- **Status Final:** ${failedTests === 0 ? '✅ Aprovado' : '❌ Reprovado'}\n\n`;

    report += `## Detalhamento por Seção\n\n`;
    report += `| Seção | Configuração | Status | Duração | Observações |\n`;
    report += `| :--- | :--- | :--- | :--- | :--- |\n`;

    results.forEach(r => {
        const statusIcon = r.status === 'PASS' ? '✅' : '❌';
        report += `| ${r.section} | ${r.setting} | ${statusIcon} ${r.status} | ${r.duration}ms | ${r.observation || r.error || '-'} |\n`;
    });

    report += `\n## Problemas Encontrados\n\n`;
    if (failedTests === 0) {
        report += `Nenhum problema técnico encontrado durante a execução.\n`;
    } else {
        results.filter(r => r.status === 'FAIL').forEach(r => {
            report += `### ❌ [${r.section}] ${r.setting}\n`;
            report += `- **Erro:** ${r.error}\n`;
            report += `- **Comportamento Esperado:** Alteração refletida no Store e no DOM.\n\n`;
        });
    }

    report += `\n## Sugestões de Melhoria e Recomendações\n\n`;
    report += `1. **Sinalização Visual:** Adicionar indicadores de carregamento mais explícitos em operações de backup/sync.\n`;
    report += `2. **Feedback de Erro:** Implementar toasts mais detalhados para falhas de rede.\n`;
    report += `3. **Estabilidade UI:** Garantir que o estado do scroll seja mantido ao trocar de abas em dispositivos móveis.\n`;

    const reportPath = path.join(process.cwd(), 'settings-report.md');
    fs.writeFileSync(reportPath, report);
    console.log(`Relatório gerado em: ${reportPath}`);
}

generateReport();

# Plano de Melhorias - DenthermEquip

**Data**: 2025-11-29
**Versão**: 1.0
**Status**: Pendente Aprovação

---

## 🎯 Melhorias Prioritárias

### Prioridade CRÍTICA 🔴

#### 1. Corrigir Inconsistência de Tipos (marca/modelo)
**Problema**: Campos `marca` e `modelo` são obrigatórios no Prisma mas opcionais no Zod
**Impacto**: Erros em runtime, dados inconsistentes
**Estimativa**: 1 hora
**Ficheiros Afetados**:
- `src/lib/types.ts`
- `prisma/schema.prisma`

**Decisão Necessária**:
- [ ] Opção A: Tornar campos obrigatórios em ambos (recomendado)
- [ ] Opção B: Tornar campos opcionais em ambos
- [ ] Opção C: Marca obrigatória, modelo opcional

---

#### 2. Adicionar Validação Server-Side
**Problema**: Server actions não validam dados recebidos
**Impacto**: Vulnerabilidade de segurança, dados inválidos no BD
**Estimativa**: 3 horas
**Ficheiros Afetados**:
- `src/actions/equipment.ts`

**Tarefas**:
- [ ] Validar dados com Zod em `createEquipment`
- [ ] Validar dados com Zod em `updateEquipment`
- [ ] Retornar erros de validação específicos
- [ ] Adicionar testes para validação

---

#### 3. Eliminar Type Casting (`as any`)
**Problema**: Uso excessivo de `as any` desativa type checking
**Impacto**: Bugs não detectados, refactoring arriscado
**Estimativa**: 4 horas
**Ficheiros Afetados**:
- `src/components/EquipmentForm.tsx`
- `src/actions/equipment.ts`

**Tarefas**:
- [ ] Corrigir tipos do `zodResolver`
- [ ] Criar tipos discriminados para campos técnicos
- [ ] Usar type guards adequados
- [ ] Remover todos os `as any`

---

### Prioridade ALTA 🟠

#### 4. Validação e Tratamento de Datas
**Problema**: Conversão de datas sem validação pode causar erros
**Estimativa**: 2 horas
**Ficheiros Afetados**:
- `src/actions/equipment.ts`
- `src/lib/types.ts`

**Implementação**:
```typescript
// Adicionar helper de validação
const validateDate = (dateString: string): Date | null => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

// Usar no sanitization
if (sanitizedData.dataFabrico) {
  const validDate = validateDate(sanitizedData.dataFabrico);
  if (!validDate) {
    throw new Error("Data de fabricação inválida");
  }
  sanitizedData.dataFabrico = validDate.toISOString();
}
```

---

#### 5. Definir Campos Técnicos como Obrigatórios
**Problema**: Equipamentos podem ser salvos sem especificações técnicas
**Estimativa**: 2 horas
**Ficheiros Afetados**:
- `src/lib/types.ts`

**Decisão Necessária**: Definir quais campos são realmente obrigatórios por tipo de equipamento

**Sugestão**:
```typescript
// Esquentador: energia, potência, rendimentos = OBRIGATÓRIOS
// Termoacumulador: volume, potência, rendimento = OBRIGATÓRIOS
// etc.
```

---

### Prioridade MÉDIA 🟡

#### 6. Melhorar Mensagens de Erro
**Problema**: Erros genéricos não ajudam o utilizador
**Estimativa**: 2 horas
**Ficheiros Afetados**:
- `src/components/EquipmentForm.tsx`
- `src/actions/equipment.ts`

**Implementação**:
```typescript
// Criar tipos de erro específicos
type ErrorType =
  | { type: 'validation', field: string, message: string }
  | { type: 'network', message: string }
  | { type: 'server', message: string };

// Retornar erros estruturados
return {
  success: false,
  error: {
    type: 'validation',
    field: 'marca',
    message: 'Marca é obrigatória'
  }
};
```

---

#### 7. Validação de Upload de Ficheiros
**Problema**: Sem limite de tamanho ou validação adequada
**Estimativa**: 2 horas
**Ficheiros Afetados**:
- `src/components/EquipmentForm.tsx`

**Implementação**:
```typescript
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validar tipo
  if (file.type !== "application/pdf") {
    setError("Apenas ficheiros PDF são permitidos");
    return;
  }

  // Validar tamanho
  if (file.size > MAX_FILE_SIZE) {
    setError("Ficheiro demasiado grande. Máximo: 5MB");
    return;
  }

  // Processar...
};
```

---

#### 8. Otimizar Lógica de Atualização de Tipo
**Problema**: Queries duplicadas, lógica complexa
**Estimativa**: 2 horas
**Ficheiros Afetados**:
- `src/actions/equipment.ts`

**Refactoring Sugerido**:
```typescript
// Criar função helper
function clearTechnicalFields(type: EquipmentType, data: any) {
  const fieldsByType = {
    'Esquentador': ['energia', 'potencia', 'rendimentoBase', 'rendimentoCorrigido'],
    'Termoacumulador': ['volume', 'potencia', 'rendimento', 'temQPR', 'valorQPR'],
    // ...
  };

  const allFields = Object.values(fieldsByType).flat();
  const fieldsToKeep = fieldsByType[type] || [];

  const cleared: any = {};
  allFields.forEach(field => {
    if (!fieldsToKeep.includes(field)) {
      cleared[field] = null;
    }
  });

  return cleared;
}
```

---

### Prioridade BAIXA 🟢

#### 9. Remover Code Smells
**Estimativa**: 1 hora
**Tarefas**:
- [ ] Remover `console.log` statements
- [ ] Remover `useEffect` vazio (EquipmentForm.tsx:61-65)
- [ ] Extrair magic numbers para constantes
- [ ] Padronizar comentários (EN vs PT)

---

#### 10. Melhorar Acessibilidade
**Estimativa**: 3 horas
**Tarefas**:
- [ ] Adicionar `aria-label` em botões de ação
- [ ] Melhorar labels de inputs de ficheiro
- [ ] Adicionar feedback para screen readers
- [ ] Testar com keyboard navigation

---

#### 11. Migrar Armazenamento de Mídia
**Problema**: Base64 não é ideal para produção
**Estimativa**: 8 horas (complexo)
**Opções**:
- [ ] AWS S3
- [ ] Cloudinary
- [ ] Vercel Blob Storage
- [ ] Supabase Storage

**Nota**: Pode ser adiado para fase 2

---

## 📋 Plano de Implementação

### Fase 1: Correções Críticas (Sprint 1 - 2 dias)
**Objetivo**: Eliminar vulnerabilidades e inconsistências críticas

#### Dia 1 (4 horas)
```
09:00 - 10:00  | Decisão sobre campos obrigatórios
10:00 - 11:00  | Corrigir inconsistência marca/modelo
11:00 - 13:00  | Eliminar type casting (parte 1)
14:00 - 15:00  | Code review e testes
```

#### Dia 2 (4 horas)
```
09:00 - 10:00  | Eliminar type casting (parte 2)
10:00 - 13:00  | Adicionar validação server-side
14:00 - 15:00  | Testes de integração
```

**Entregáveis**:
- ✅ Tipos consistentes entre Zod e Prisma
- ✅ Zero `as any` no código
- ✅ Validação server-side implementada
- ✅ Testes passando

---

### Fase 2: Melhorias de Alta Prioridade (Sprint 2 - 2 dias)

#### Dia 3 (4 horas)
```
09:00 - 11:00  | Validação e tratamento de datas
11:00 - 13:00  | Definir campos obrigatórios por tipo
14:00 - 15:00  | Testes e validação
```

#### Dia 4 (2 horas)
```
09:00 - 11:00  | Implementar e testar mudanças
```

**Entregáveis**:
- ✅ Datas validadas corretamente
- ✅ Campos técnicos obrigatórios definidos
- ✅ Schemas Zod atualizados

---

### Fase 3: Melhorias de Média Prioridade (Sprint 3 - 2 dias)

#### Dia 5 (4 horas)
```
09:00 - 11:00  | Melhorar mensagens de erro
11:00 - 13:00  | Validação de upload de ficheiros
14:00 - 15:00  | Testes
```

#### Dia 6 (2 horas)
```
09:00 - 11:00  | Otimizar lógica de atualização
```

**Entregáveis**:
- ✅ Sistema de erros estruturado
- ✅ Upload com validação de tamanho
- ✅ Código mais limpo e eficiente

---

### Fase 4: Polimento (Sprint 4 - 1 dia)

#### Dia 7 (4 horas)
```
09:00 - 10:00  | Remover code smells
10:00 - 13:00  | Melhorar acessibilidade
14:00 - 15:00  | Code review final
```

**Entregáveis**:
- ✅ Código limpo sem console.logs
- ✅ Melhor acessibilidade
- ✅ Constantes extraídas

---

### Fase 5: (Opcional - Futuro)

#### Migração de Armazenamento de Mídia
**Estimativa**: 1-2 semanas
**Pode ser feito em paralelo com desenvolvimento de novas features**

---

## 📊 Resumo de Esforço

| Fase | Prioridade | Tempo Estimado | Complexidade |
|------|-----------|----------------|--------------|
| Fase 1 | CRÍTICA | 8 horas | Alta |
| Fase 2 | ALTA | 6 horas | Média |
| Fase 3 | MÉDIA | 6 horas | Média |
| Fase 4 | BAIXA | 4 horas | Baixa |
| **TOTAL** | - | **24 horas** | - |

**Nota**: Tempo real pode variar ±20% dependendo de decisões de design e complexidade encontrada.

---

## ✅ Checklist de Implementação

### Antes de Começar
- [ ] Criar branch: `refactor/priority-improvements`
- [ ] Backup da base de dados (se aplicável)
- [ ] Comunicar equipa sobre mudanças

### Durante Implementação
- [ ] Commits atómicos com mensagens descritivas
- [ ] Testes para cada mudança
- [ ] Documentar decisões importantes

### Após Cada Fase
- [ ] Code review
- [ ] Testes de regressão
- [ ] Update documentação
- [ ] Merge para develop

### Antes de Deploy
- [ ] Teste completo em staging
- [ ] Verificar todas as migrações de BD
- [ ] Plano de rollback preparado
- [ ] Monitorização configurada

---

## 🧪 Estratégia de Testes

### Testes Unitários
```typescript
// Validação de datas
describe('validateDate', () => {
  it('should accept valid ISO dates', () => {
    expect(validateDate('2024-01-15')).toBeInstanceOf(Date);
  });

  it('should reject invalid dates', () => {
    expect(validateDate('invalid')).toBeNull();
  });
});

// Validação server-side
describe('createEquipment', () => {
  it('should reject missing required fields', async () => {
    await expect(createEquipment({})).rejects.toThrow();
  });

  it('should accept valid equipment data', async () => {
    const data = { type: 'Esquentador', marca: 'Test', ... };
    const result = await createEquipment(data);
    expect(result.success).toBe(true);
  });
});
```

### Testes de Integração
- [ ] Criar equipamento com todos os campos
- [ ] Criar equipamento com campos mínimos
- [ ] Atualizar tipo de equipamento
- [ ] Upload de ficheiros
- [ ] Validação de erros

### Testes E2E (Opcional)
- [ ] Fluxo completo: criar → editar → visualizar → deletar
- [ ] Upload de PDF e imagem
- [ ] Mudança de tipo de equipamento

---

## 🚨 Riscos e Mitigação

### Risco 1: Breaking Changes
**Impacto**: Alto
**Probabilidade**: Média
**Mitigação**:
- Manter backward compatibility onde possível
- Criar migração de dados se necessário
- Testes extensivos antes de deploy

### Risco 2: Dados Existentes Inválidos
**Impacto**: Alto
**Probabilidade**: Alta (se campos forem obrigatórios)
**Mitigação**:
- Script de validação de dados existentes
- Migração para preencher campos obrigatórios
- Permitir valores default temporários

### Risco 3: Mudanças de Tipo Complexas
**Impacto**: Médio
**Probabilidade**: Baixa
**Mitigação**:
- Testes com tipos reais do sistema
- Type guards robustos
- Documentação clara

---

## 📝 Notas de Decisão

### Decisão 1: Campos Obrigatórios
**Data**: Pendente
**Responsável**: [Nome]
**Decisão**: [A preencher]

### Decisão 2: Estratégia de Armazenamento
**Data**: Pendente
**Responsável**: [Nome]
**Decisão**: [Manter Base64 por enquanto / Migrar para cloud storage]

### Decisão 3: Campos Técnicos
**Data**: Pendente
**Responsável**: [Nome]
**Decisão**: [Definir lista de campos obrigatórios por tipo]

---

## 📞 Contactos e Recursos

### Documentação Relevante
- [Zod Documentation](https://zod.dev)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Hook Form](https://react-hook-form.com)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

### Code Review
- Reviewer 1: [Nome]
- Reviewer 2: [Nome]

---

## 📈 Métricas de Sucesso

### Antes das Melhorias
- Type Safety Score: 4/10
- Validação Score: 5/10
- Code Quality: 6/10

### Após Fase 1-2 (Target)
- Type Safety Score: 8/10
- Validação Score: 9/10
- Code Quality: 8/10

### Após Todas as Fases (Target)
- Type Safety Score: 9/10
- Validação Score: 10/10
- Code Quality: 9/10

### KPIs
- [ ] Zero `as any` no código
- [ ] 100% de validação server-side
- [ ] <5 type errors no TypeScript strict mode
- [ ] Code coverage >80% nas partes críticas

---

## 🔄 Próximos Passos

1. **Revisão deste plano** com a equipa
2. **Decisões necessárias** sobre campos obrigatórios
3. **Aprovação** para começar Fase 1
4. **Criar branch** e iniciar implementação

---

**Última Atualização**: 2025-11-29
**Versão do Documento**: 1.0
**Status**: Aguardando Aprovação

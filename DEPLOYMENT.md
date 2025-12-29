# Deployment Guide

## GitHub Secrets Necessários

1. **VERCEL_TOKEN** - Token da Vercel API
   - Obter em:  https://vercel.com/account/tokens

2. **VERCEL_ORG_ID** - ID da sua organização/usuário Vercel
   - Executar: `vercel whoami` ou ver em `.vercel/project.json`

3. **VERCEL_PROJECT_ID** - ID do projeto
   - Ver em `.vercel/project.json` após `vercel link`

## Passos para Configurar

### 1. Instalar Vercel CLI
```bash
npm install -g vercel
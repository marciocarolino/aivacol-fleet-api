FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./

FROM base AS dependencies

RUN npm ci --ignore-scripts

FROM dependencies AS build

RUN printf '%s\n' \
  '{' \
  '  "compilerOptions": {' \
  '    "module": "nodenext",' \
  '    "moduleResolution": "nodenext",' \
  '    "resolvePackageJsonExports": true,' \
  '    "esModuleInterop": true,' \
  '    "isolatedModules": true,' \
  '    "declaration": true,' \
  '    "removeComments": true,' \
  '    "emitDecoratorMetadata": true,' \
  '    "experimentalDecorators": true,' \
  '    "allowSyntheticDefaultImports": true,' \
  '    "target": "ES2023",' \
  '    "sourceMap": true,' \
  '    "outDir": "./dist",' \
  '    "incremental": true,' \
  '    "skipLibCheck": true,' \
  '    "strictNullChecks": true,' \
  '    "forceConsistentCasingInFileNames": true,' \
  '    "noImplicitAny": false,' \
  '    "strictBindCallApply": false,' \
  '    "noFallthroughCasesInSwitch": false,' \
  '    "strictPropertyInitialization": false' \
  '  }' \
  '}' > tsconfig.json
RUN printf '%s\n' \
  '{' \
  '  "extends": "./tsconfig.json",' \
  '  "exclude": ["node_modules", "test", "dist", "**/*spec.ts"]' \
  '}' > tsconfig.build.json
COPY src ./src

RUN npm run build

FROM base AS production-dependencies

RUN npm ci --omit=dev --ignore-scripts

FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package*.json ./

EXPOSE 3000

CMD ["node", "dist/main.js"]

# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y este proyecto sigue [Semantic Versioning](https://semver.org/lang/es/).

## [Unreleased]

## [0.1.0] - 2026-09-22

### Added

- Puertos `IAiAssistant` (modelos de texto), `IAiEvaluator` (modelos de evaluación) e `IAiCacheRepository` (caché de resultados).
- Adaptadores de texto para Gemini, Anthropic, OpenAI y Vercel AI Gateway, y adaptador de evaluación para Vercel AI Gateway con Jev (`typesafe-ai/jev`) por defecto. Extraídos de [srs-wizard](https://github.com/rogersx27/srs-wizard).
- `createAiAssistant` / `createAiEvaluator`: fábricas que eligen el proveedor según variables de entorno e importan solo el SDK necesario.
- Utilidades `withTimeout`, `hashContent` y `withCache` (caché por hash del contenido que solo guarda resultados exitosos).
- Adaptadores nulos (`NullAiAssistant`, `NullAiEvaluator`) para degradar sin IA.

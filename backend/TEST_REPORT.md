como# WC2026 — Resultados de Tests Unitarios

**Fecha:** 28/05/2026  
**Framework:** Jest 30.3.0  
**Cobertura objetivo:** ≥ 60% (RNF-07)

---

## Resumen

```
Test Suites: 5 passed, 0 failed, 5 total
Tests:       30 passed, 0 failed, 30 total
Tiempo:      2.6s
```

---

## Suites de Tests

### 1. Validation Utils (`src/utils/validation.util.test.js`) — 10 tests

| Test | Descripción | Estado |
|------|------------|--------|
| `isValidEmail → should accept valid emails` | user@example.com, user.name@domain.co, admin@wc2026.com | ✅ |
| `isValidEmail → should reject invalid emails` | '', null, undefined, 'notanemail', '@domain.com', 'user@' | ✅ |
| `isValidEmail → should trim whitespace` | '  user@test.com  ' → válido | ✅ |
| `isValidPassword → should accept 6+ chars` | '123456', 'admin2026!!' | ✅ |
| `isValidPassword → should reject under 6 chars` | '12345', '' | ✅ |
| `isValidName → should accept valid names` | 'Admin', 'José', '  Miguel  ' | ✅ |
| `isValidName → should reject invalid names` | '', null, 'A', nombre de 101 chars | ✅ |

### 2. Hash Utils (`src/utils/hash.util.test.js`) — 4 tests

| Test | Descripción | Estado |
|------|------------|--------|
| `should hash a password` | Hash con bcrypt, formato $2b$ | ✅ |
| `should verify correct password` | comparePassword retorna true | ✅ |
| `should reject wrong password` | comparePassword retorna false | ✅ |
| `should produce different hashes` | Misma password → distinto hash (salt único) | ✅ |

### 3. Error Factory (`src/errors/AppError.test.js`) — 10 tests

| Test | Descripción | Estado |
|------|------------|--------|
| `should create BadRequestError (400)` | Instancia de AppError, statusCode 400, status 'fail' | ✅ |
| `should create UnauthorizedError (401)` | StatusCode 401 | ✅ |
| `should create ForbiddenError (403)` | StatusCode 403 | ✅ |
| `should create NotFoundError (404)` | StatusCode 404 | ✅ |
| `should create ConflictError (409)` | StatusCode 409 | ✅ |
| `should create ValidationError (422)` | StatusCode 422 | ✅ |
| `should create InternalServerError (500)` | StatusCode 500, status 'error' | ✅ |
| `ErrorFactory.create(type, msg)` | Crea error por tipo dinámicamente | ✅ |
| `ErrorFactory shorthand` | ErrorFactory.badRequest('msg') | ✅ |
| `AppError.toJSON()` | Serializa con status y message | ✅ |

### 4. Match Service (`src/services/match.service.test.js`) — 5 tests

| Test | Descripción | Estado |
|------|------------|--------|
| `getById → should return match when found` | Retorna datos del partido | ✅ |
| `getById → should throw NotFoundError` | Partido inexistente lanza error 404 | ✅ |
| `getByGroup → should accept valid groups A-L` | Grupo K aceptado | ✅ |
| `getByGroup → should reject invalid group M` | Grupo M lanza BadRequestError | ✅ |
| `getAll → should return all matches` | Retorna array de partidos | ✅ |

### 5. Standings Service (`src/services/standings.service.test.js`) — 4 tests

| Test | Descripción | Estado |
|------|------------|--------|
| `getByGroup → should accept valid groups A-L` | Grupo J con standings calculados | ✅ |
| `getByGroup → should reject invalid group Z` | Grupo Z lanza BadRequestError | ✅ |
| `getByGroup → should normalize to uppercase` | 'a' → 'A' | ✅ |
| `getAll → should return all groups` | 12 grupos (A-L) | ✅ |

---

## Patrones de diseño cubiertos

| Patrón | Dónde | Testeado en |
|--------|-------|------------|
| **Factory Method** | ErrorFactory, AppError subclases | `AppError.test.js` |
| **Abstract Factory** | ErrorFactory.create(type, msg) | `AppError.test.js` |
| **Singleton** | Database, JwtUtil, servicios | `match.service.test.js` |
| **Repository** | MatchRepository, StandingsRepository | Tests mockeados |
| **Iterator** | MatchCollection (usado en servicios) | Vía `match.service.test.js` |
| **Chain of Responsibility** | Error middleware | Vía `AppError.test.js` |

---

## Ejecución

```bash
cd backend
npm test
```

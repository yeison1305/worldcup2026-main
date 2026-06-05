#!/usr/bin/env node
/**
 * MCP Server — World Cup 2026 Predictor
 * 
 * Expone herramientas de predicción via Model Context Protocol (MCP).
 * Comunica con el microservicio Java (Spring Boot) via HTTP.
 * Proveedor LLM: DeepSeek API.
 * 
 * Tools:
 *   - predict_match:  Predice ganador de un partido (homeTeam, awayTeam)
 *   - get_champion:   Predice campeón y top 4 del torneo
 *   - get_stats:      Estadísticas del modelo
 */

const JAVA_API_URL = 'http://localhost:8080/api';

function jsonRpc(id, result) {
  return JSON.stringify({ jsonrpc: '2.0', id, result }) + '\n';
}

function jsonRpcError(id, code, message) {
  return JSON.stringify({ jsonrpc: '2.0', id, error: { code, message } }) + '\n';
}

const TOOLS = [
  {
    name: 'predict_match',
    description: 'Predice el ganador de un partido de fútbol usando el modelo heurístico + DeepSeek LLM para explicación.',
    inputSchema: {
      type: 'object',
      properties: {
        homeTeamName: { type: 'string', description: 'Nombre del equipo local' },
        awayTeamName: { type: 'string', description: 'Nombre del equipo visitante' },
      },
      required: ['homeTeamName', 'awayTeamName'],
    },
  },
  {
    name: 'get_champion',
    description: 'Predice el campeón del torneo basado en la simulación del bracket con datos de fase de grupos.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'get_stats',
    description: 'Devuelve estadísticas del modelo: partidos totales, predicciones generadas, etc.',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function handleRequest(request) {
  const { method, params, id } = request;

  try {
    switch (method) {
      case 'initialize':
        return jsonRpc(id, {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: { name: 'wc2026-predictor', version: '1.0.0' },
        });

      case 'tools/list':
        return jsonRpc(id, { tools: TOOLS });

      case 'tools/call':
        return await handleToolCall(id, params);

      default:
        return jsonRpcError(id, -32601, `Method not found: ${method}`);
    }
  } catch (err) {
    return jsonRpcError(id, -32603, err.message);
  }
}

async function handleToolCall(id, { name, arguments: args }) {
  switch (name) {
    case 'predict_match': {
      const res = await fetch(`${JAVA_API_URL}/predictions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args),
      });
      const data = await res.json();
      return jsonRpc(id, {
        content: [{ type: 'text', text: JSON.stringify(data.data, null, 2) }],
      });
    }

    case 'get_champion': {
      const res = await fetch('http://localhost:3000/api/predictions/champion');
      const data = await res.json();
      return jsonRpc(id, {
        content: [{ type: 'text', text: JSON.stringify(data.data, null, 2) }],
      });
    }

    case 'get_stats': {
      const res = await fetch('http://localhost:3000/api/predictions/stats');
      const data = await res.json();
      return jsonRpc(id, {
        content: [{ type: 'text', text: JSON.stringify(data.data, null, 2) }],
      });
    }

    default:
      return jsonRpcError(id, -32602, `Unknown tool: ${name}`);
  }
}

// Read JSON-RPC messages from stdin
let buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', async (chunk) => {
  buffer += chunk;
  const lines = buffer.split('\n');
  buffer = lines.pop() || '';

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const request = JSON.parse(line);
      const response = await handleRequest(request);
      process.stdout.write(response);
    } catch (err) {
      process.stdout.write(jsonRpcError(null, -32700, 'Parse error'));
    }
  }
});

process.stderr.write('MCP Server — WC2026 Predictor ready (stdio)\n');

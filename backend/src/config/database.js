// src/config/database.js
// Usar Supabase SDK (misma ruta que el MCP)
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = 'https://zrpmibwlmvsyfavbqdxd.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpycG1pYndsbXZzeWZhdmJxZHhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE4MTkyMiwiZXhwIjoyMDkwNzU3OTIyfQ.PzLA-uEd0vFIkBJgrZxhrFM-lR5lN-eXUf7FzreYb9M';

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    
    this.supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false }
    });
    
    console.log('Using Supabase SDK...');
    Database.instance = this;
  }

  query(text, params) {
    // Convertir queries SQL a llamadas del SDK
    return this._executeQuery(text, params);
  }
  
  async _executeQuery(sql, params) {
    // Parse básico de queries simples
    const sqlLower = sql.toLowerCase().trim();
    
    if (sqlLower.startsWith('select')) {
      // SELECT: usar from().select()
      const fromMatch = sqlLower.match(/from\s+(\w+)/);
      if (fromMatch) {
        const table = fromMatch[1];
        let query = this.supabase.from(table).select('*');
        
        // WHERE simple
        const whereMatch = sql.match(/where\s+(\w+)\s*=\s*\$(\d+)/i);
        if (whereMatch) {
          const col = whereMatch[1];
          const paramIdx = parseInt(whereMatch[2]) - 1;
          query = query.eq(col, params?.[paramIdx]);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        return { rows: data || [], command: 'SELECT', rowCount: data?.length || 0 };
      }
    }
    
    if (sqlLower.startsWith('insert')) {
      // INSERT
      const intoMatch = sql.match(/insert\s+into\s+(\w+)\s*\(([^)]+)\)/i);
      if (intoMatch) {
        const table = intoMatch[1];
        const columns = intoMatch[2].split(',').map(c => c.trim());
        const data = {};
        columns.forEach((col, i) => {
          data[col] = params?.[i];
        });
        
        const { data: result, error } = await this.supabase.from(table).insert(data).select();
        if (error) throw error;
        return { rows: result || [], command: 'INSERT', rowCount: 1 };
      }
    }
    
    if (sqlLower.startsWith('update')) {
      // UPDATE
      const tableMatch = sql.match(/update\s+(\w+)\s+set/i);
      const whereMatch = sql.match(/where\s+(\w+)\s*=\s*\$(\d+)/i);
      if (tableMatch && whereMatch) {
        const table = tableMatch[1];
        const whereCol = whereMatch[1];
        const paramIdx = parseInt(whereMatch[2]) - 1;
        const whereVal = params?.[paramIdx];
        
        const setMatch = sql.match(/set\s+(.+?)\s+where/i);
        if (setMatch) {
          const setStr = setMatch[1];
          const setPairs = setStr.split(',').map(s => s.trim());
          const data = {};
          let paramOffset = 0;
          
          setPairs.forEach(pair => {
            const [col, val] = pair.split('=').map(s => s.trim());
            if (val?.startsWith('$')) {
              const idx = parseInt(val.replace('$', '')) - 1;
              data[col] = params?.[idx];
            }
          });
          
          const { data: result, error } = await this.supabase.from(table).update(data).eq(whereCol, whereVal).select();
          if (error) throw error;
          return { rows: result || [], command: 'UPDATE', rowCount: 1 };
        }
      }
    }
    
    if (sqlLower.startsWith('delete')) {
      // DELETE
      const fromMatch = sql.match(/delete\s+from\s+(\w+)\s+where\s+(\w+)\s*=\s*\$(\d+)/i);
      if (fromMatch) {
        const table = fromMatch[1];
        const whereCol = fromMatch[2];
        const paramIdx = parseInt(fromMatch[3]) - 1;
        const whereVal = params?.[paramIdx];
        
        const { error } = await this.supabase.from(table).delete().eq(whereCol, whereVal);
        if (error) throw error;
        return { rows: [], command: 'DELETE', rowCount: 1 };
      }
    }
    
    // Fallback: no soportado
    throw new Error('Query not supported by SDK: ' + sql.substring(0, 50));
  }
  
  // Compatibilidad con repos existentes
  from(table) {
    const db = this;
    return {
      select: (columns = '*') => {
        return db.supabase.from(table).select(columns === '*' ? undefined : columns)
          .then(({ data, error }) => {
            if (error) throw error;
            return { data, error: null };
          });
      },
      insert: (data) => {
        return db.supabase.from(table).insert(data).select()
          .then(({ data, error }) => ({ data: data?.[0], error }));
      },
      update: (data) => {
        return {
          eq: (column, value) => {
            return db.supabase.from(table).update(data).eq(column, value).select()
              .then(({ data, error }) => ({ data: data?.[0], error }));
          }
        };
      },
      delete: () => {
        return {
          eq: (column, value) => {
            return db.supabase.from(table).delete().eq(column, value)
              .then(({ error }) => ({ data: null, error }));
          }
        };
      }
    };
  }
}

module.exports = new Database();
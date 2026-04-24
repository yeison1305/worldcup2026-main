// Test simple de red
const net = require('net');

console.log('Testing connection to supabase.co:6543 (pooler)...');

const client = new net.Socket();

client.connect(6543, 'zrpmibwlmvsyfavbqdxd.supabase.co', () => {
  console.log('✅ Puerto 6543 ABIERTO');
  client.destroy();
  process.exit(0);
});

client.on('error', (err) => {
  console.log('❌ Error:', err.message);
  console.log('Code:', err.code);
  process.exit(1);
});

client.setTimeout(8000, () => {
  console.log('⏱️ Timeout - el puerto no responde');
  client.destroy();
  process.exit(1);
});
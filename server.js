const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const envFile = path.join(root, '.env');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
}
const mime = { '.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8' };
const schema = { type:'object', additionalProperties:false, required:['title','urgency','summary','dates','tasks','next'], properties:{ title:{type:'string'},urgency:{type:'string',enum:['low','medium','high']},summary:{type:'string'},dates:{type:'array',items:{type:'array',minItems:2,maxItems:2,items:{type:'string'}}},tasks:{type:'array',items:{type:'array',minItems:4,maxItems:4,items:{type:'string'}}},next:{type:'string'} } };
const instructions = `You organize an everyday message into a concise, practical personal action plan. Return only JSON following the provided schema. Dates should be short display labels. Each task is [title, category, priority, dueDate]. Never invent specific facts; if a date is missing, say “When convenient” or “Today” only when justified.`;

async function analyze(text) {
  if (!process.env.OPENAI_API_KEY) throw new Error('AI analysis is not configured. Add OPENAI_API_KEY to a .env file.');
  const response = await fetch('https://api.openai.com/v1/responses', { method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${process.env.OPENAI_API_KEY}`}, body:JSON.stringify({model:process.env.OPENAI_MODEL || 'gpt-5.6',instructions,input:text,text:{format:{type:'json_schema',name:'life_admin_plan',strict:true,schema}}}) });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error?.message || 'OpenAI request failed');
  return JSON.parse(body.output_text);
}

http.createServer(async (req,res) => {
  if (req.method === 'POST' && req.url === '/api/organize') {
    let raw=''; req.on('data',chunk=>raw+=chunk); req.on('end',async()=>{ try { const input=JSON.parse(raw); if (!input.text || typeof input.text !== 'string') throw new Error('Message text is required.'); const plan=await analyze(input.text.slice(0,12000)); res.writeHead(200,{'Content-Type':'application/json'}); res.end(JSON.stringify(plan)); } catch(error) { res.writeHead(process.env.OPENAI_API_KEY?500:503,{'Content-Type':'application/json'}); res.end(JSON.stringify({error:error.message})); } }); return;
  }
  const requested = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const file = path.normalize(path.join(root,requested));
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404,{'Content-Type':'text/plain'}); return res.end('Not found'); }
  res.writeHead(200,{'Content-Type':mime[path.extname(file)] || 'application/octet-stream'}); fs.createReadStream(file).pipe(res);
}).listen(process.env.PORT || 3000,()=>console.log(`Life Admin is running at http://localhost:${process.env.PORT || 3000}`));

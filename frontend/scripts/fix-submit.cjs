const fs = require('fs');
const file = 'c:/Users/Administrador/Documents/GitHub/Base-De-Datos-Autodata/frontend/scripts/generate-form-equipamiento-updated.cjs';
let content = fs.readFileSync(file, 'utf-8');

content = content.replace(
  /return \(\n    <form className="space-y-6" onSubmit=\{\(e\) => \{ e\.preventDefault\(\); if \(onSendRevision\) handleAction\('revision'\); \}\}>/,
  `return (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); if (onSendRevision) handleAction('revision'); }} onKeyDown={(e) => { if (e.key === 'Enter' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'TEXTAREA') e.preventDefault(); }}>`
);

fs.writeFileSync(file, content);

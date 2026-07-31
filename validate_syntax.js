const fs = require('fs');
const vm = require('vm');

try {
    const html = fs.readFileSync('mockup.html', 'utf8');
    const scriptRegex = /<script>([\s\S]*?)<\/script>/gi;
    let match;
    let count = 0;
    let hasError = false;
    
    while ((match = scriptRegex.exec(html)) !== null) {
        count++;
        const code = match[1];
        try {
            new vm.Script(code);
            console.log(`[PASS] Script block #${count} syntax is correct.`);
        } catch (e) {
            console.error(`[FAIL] Script block #${count} has a syntax error:`);
            console.error(e.stack || e);
            hasError = true;
        }
    }
    
    if (count === 0) {
        console.log("[WARN] No <script> tags found in mockup.html.");
        process.exit(1);
    }
    
    if (hasError) {
        process.exit(1);
    } else {
        console.log("[SUCCESS] All JavaScript syntax in mockup.html is fully valid!");
        process.exit(0);
    }
} catch (err) {
    console.error("[ERROR] Failed to run syntax check:", err.message);
    process.exit(1);
}

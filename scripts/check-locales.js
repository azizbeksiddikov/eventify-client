// Checks that every language has the same translation files and keys as English.
// Usage: npm run check:i18n [-- <path to the backend libs/enums/common.enum.ts>]
// Fails (exit 1) when a file or key is missing or extra, a value is empty,
// {{placeholders}} differ from English, an error code used in the app has no text,
// or (when the backend file is given) a backend error code has no text in some language.
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const localesDir = path.join(root, "public", "locales");
const BASE = "en";

function check(backendEnumPath) {
	const problems = [];
	const langs = fs.readdirSync(localesDir).filter((d) => fs.statSync(path.join(localesDir, d)).isDirectory());
	if (!langs.includes(BASE)) return [`base language "${BASE}" not found in public/locales`];

	const read = (lang, file) => JSON.parse(fs.readFileSync(path.join(localesDir, lang, file), "utf8"));
	const files = fs.readdirSync(path.join(localesDir, BASE)).filter((f) => f.endsWith(".json"));
	const placeholders = (v) => (typeof v === "string" ? (v.match(/\{\{\s*\w+\s*\}\}/g) || []).sort().join(",") : "");

	for (const lang of langs) {
		const have = fs.readdirSync(path.join(localesDir, lang)).filter((f) => f.endsWith(".json"));
		for (const f of files) if (!have.includes(f)) problems.push(`${lang}/${f}: file missing`);
		for (const f of have) if (!files.includes(f)) problems.push(`${lang}/${f}: file not in ${BASE}`);
	}

	for (const f of files) {
		const base = read(BASE, f);
		for (const lang of langs) {
			if (lang === BASE || !fs.existsSync(path.join(localesDir, lang, f))) continue;
			const other = read(lang, f);
			for (const k of Object.keys(base)) {
				if (!(k in other)) {
					problems.push(`${lang}/${f}: missing key "${k}"`);
					continue;
				}
				if (typeof other[k] === "string" && other[k].trim() === "")
					problems.push(`${lang}/${f}: empty value for "${k}"`);
				if (placeholders(base[k]) !== placeholders(other[k]))
					problems.push(`${lang}/${f}: placeholders of "${k}" differ from ${BASE}`);
			}
			for (const k of Object.keys(other))
				if (!(k in base)) problems.push(`${lang}/${f}: extra key "${k}" not in ${BASE}`);
		}
	}

	// Every error code the app itself uses (AppError("CODE") and the codes in the rules)
	// must have a text in errors.json for each language.
	const codes = new Set();
	const walk = (dir) => {
		for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
			const full = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				if (!["node_modules", ".next", "public"].includes(entry.name)) walk(full);
			} else if (/\.(ts|tsx)$/.test(entry.name)) {
				const src = fs.readFileSync(full, "utf8");
				for (const m of src.matchAll(/new (?:AppError|toAppError)\(\s*"([A-Z][A-Z0-9_]*)"/g)) codes.add(m[1]);
				for (const m of src.matchAll(/toAppError\([^)]*,\s*"([A-Z][A-Z0-9_]*)"\)/g)) codes.add(m[1]);
			}
		}
	};
	walk(path.join(root, "libs"));
	walk(path.join(root, "src"));
	const rulesSrc = fs.readFileSync(path.join(root, "libs", "errorMessages.ts"), "utf8");
	for (const m of rulesSrc.matchAll(/,\s*"([A-Z][A-Z0-9_]*)"\],/g)) codes.add(m[1]);
	codes.add("UNKNOWN_ERROR");

	// Every backend error code (the keys of the Message enum) must have a text too.
	if (backendEnumPath) {
		const src = fs.readFileSync(backendEnumPath, "utf8");
		const from = src.indexOf("export enum Message");
		const to = src.indexOf("export enum", from + 1);
		const body = src.slice(from, to === -1 ? undefined : to);
		const backend = [...body.matchAll(/^\s+([A-Z][A-Z0-9_]*)\s*=/gm)].map((m) => m[1]);
		if (backend.length === 0) problems.push(`no error codes found in ${backendEnumPath}`);
		for (const c of backend) codes.add(c);
	}

	for (const lang of langs) {
		const errors = read(lang, "errors.json");
		for (const c of codes) if (!(c in errors)) problems.push(`${lang}/errors.json: error code "${c}" has no text`);
	}
	return problems;
}

module.exports = { check };

if (require.main === module) {
	const problems = check(process.argv[2]);
	if (problems.length) {
		console.log(problems.join("\n"));
		console.log(`\n${problems.length} problem(s)`);
		process.exit(1);
	}
	console.log("locales OK: all languages match English");
}

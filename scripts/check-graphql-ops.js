// Checks every query/mutation in apollo/ against a running API's schema.
// Usage: node scripts/check-graphql-ops.js http://localhost:4101/graphql
// Exit code 1 when any operation does not exist in the backend schema.
const fs = require("fs");
const path = require("path");
const { buildClientSchema, getIntrospectionQuery, parse, validate } = require("graphql");

(async () => {
	const url = process.argv[2] || process.env.GRAPHQL_URL;
	if (!url) {
		console.error("Pass the GraphQL URL as the first argument.");
		process.exit(2);
	}
	const res = await fetch(url, {
		method: "POST",
		headers: { "content-type": "application/json", "ngrok-skip-browser-warning": "1" },
		body: JSON.stringify({ query: getIntrospectionQuery() }),
	});
	const schema = buildClientSchema((await res.json()).data);
	let total = 0;
	let bad = 0;
	for (const f of ["apollo/user/query.ts", "apollo/user/mutation.ts", "apollo/admin/query.ts", "apollo/admin/mutation.ts"]) {
		const src = fs.readFileSync(path.join(__dirname, "..", f), "utf8");
		const re = /export const (\w+)[^=]*=\s*gql`([\s\S]*?)`/g;
		let m;
		while ((m = re.exec(src))) {
			total++;
			try {
				const errors = validate(schema, parse(m[2]));
				if (errors.length) {
					bad++;
					console.log("MISMATCH", f, m[1], "::", errors.map((e) => e.message).join(" | "));
				}
			} catch (e) {
				bad++;
				console.log("PARSE ERROR", f, m[1], e.message);
			}
		}
	}
	console.log(`operations checked: ${total}, mismatching: ${bad}`);
	process.exit(bad ? 1 : 0);
})();

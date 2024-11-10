"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetAutoincrement = void 0;
function resetAutoincrement(postgres, schema, table, sequence, prevResult) {
    return postgres
        .query(`
				BEGIN;
					-- protect against concurrent inserts while you update the counter
					LOCK TABLE ${schema}.${table} IN EXCLUSIVE MODE;
					-- Update the sequence
					SELECT setval('${schema}.${sequence}', COALESCE((SELECT MAX(id)+1 FROM ${schema}.${table}), 1), false);
				COMMIT;
				`)
        .then(() => {
        return prevResult;
    });
}
exports.resetAutoincrement = resetAutoincrement;

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const RAW_DIR = path.join(__dirname, '..', 'src', 'data', 'raw');
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'data', 'canonical');

const decisionRules = [];
const referralRules = [];

function parseValue(value) {
  if (!value) return '';

  value = value.trim();

  if (value === 'yes' || value === 'no') return value;

  if (value === 'TRUE') return 'yes';
  if (value === 'FALSE') return 'no';

  if (!Number.isNaN(Number(value))) return Number(value);

  return value;
}

function parseCondition(condition) {
  if (!condition) return [];

  const operator =
    condition.includes(' OR ') ? 'OR' :
    condition.includes(' AND ') ? 'AND' :
    null;

  const parts = condition.split(/\s+(?:OR|AND)\s+/);

  return parts.map((part) => {
    const match = part.match(
      /^(.+?)\s*(>=|<=|==|=|>|<)\s*(.+)$/
    );

    if (!match) {
      return {
        variable: part.trim(),
        operator: '=',
        value: 'yes'
      };
    }

    return {
      variable: match[1].trim(),
      operator: match[2],
      value: parseValue(match[3])
    };
  });
}

function loadCSV(file, callback) {
  return new Promise((resolve, reject) => {
    const rows = [];

    fs.createReadStream(
      path.join(RAW_DIR, file)
    )
      .pipe(csv())
      .on('data', row => rows.push(row))
      .on('end', () => resolve(callback(rows)))
      .on('error', reject);
  });
}


async function main() {

  await loadCSV(
    'decision_rules.csv',
    rows => {
      rows.forEach(row => {
        decisionRules.push({
          rule_id: Number(row.rule_id),
          priority: Number(row.priority),
          rule_name: row.rule_name,
          operator: row.logical_operator || null,
          clauses: parseCondition(row.conditions),
          gestational_stage: row.gestational_stage,
          risk_level: row.risk_level,
          recommendation: row.recommendation,
          facility_level: row.facility_level,
          confidence: row.confidence,
          education_module: row.education_module,
          explanation: row.explanation_key,
          rule_outcome: row.rule_outcome,
          source: {
            citations: [row.source],
            pages: row.page ? [row.page] : []
          }
        });
      });
    }
  );


  await loadCSV(
    'referral_rules.csv',
    rows => {
      rows.forEach(row => {

        referralRules.push({
          rule_id: `referral_${row.rule_id}`,
          priority: 1,
          rule_name: `Referral: ${row.if_variable}`,
          operator: null,
          clauses: [
            {
              variable: row.if_variable,
              operator: row.operator,
              value: row.value === 'TRUE' ? 'yes' : row.value
            }
          ],
          gestational_stage: 'Any',
          risk_level: row.urgency,
          recommendation: row.recommendation,
          facility_level: row.facility,
          confidence: 'High',
          education_module: 'Danger Signs',
          explanation:
  row.notes?.trim() ||
  row.clinical_notes?.trim() ||
  row.comments?.trim() ||
  'Referral rule from medic-reviewed referral criteria.',
          rule_outcome: 'STOP',
          source: {
  citations: [row.source],
  pages: [row.page],
  notes:
    row.notes ||
    row.clinical_notes ||
    row.comments ||
    ''
}
        });

      });
    }
  );


  const output = {
    _meta: {
      generated_by: 'scripts/normalize.js (CSV)',
      generated_at: new Date().toISOString(),
      source_files: [
        'decision_rules.csv',
        'referral_rules.csv'
      ]
    },
    rules: [
      ...decisionRules,
      ...referralRules
    ].sort(
      (a,b) => a.priority - b.priority
    )
  };


  fs.mkdirSync(
    OUTPUT_DIR,
    {recursive:true}
  );


  fs.writeFileSync(
    path.join(
      OUTPUT_DIR,
      'rules.json'
    ),
    JSON.stringify(output,null,2)
  );


  console.log(
    `✓ Generated ${output.rules.length} rules`
  );
}


main();
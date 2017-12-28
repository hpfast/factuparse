const parse = require('csv-parse/lib/sync');
const fs = require('fs');
let inputfile = '';
if (process.argv.length === 3) {
  inputfile = process.argv[2];
} else {
  console.log('usage: factup INPUT_FILE > OUTPUT_FILE')
}

const input = fs.readFileSync(inputfile, 'utf-8');
const table = parse(input, {columns: true});

function selectAccount(record){
  if (record.Indienwijze === 'Vecozo') {
    record.Account = 'Verzekeraars'
  } else {
    record.Account = 'Zelfbetalers'
  }
  return record;
}

function formatDate(record) {
  record.Datum = record.Datum.split('-').reverse().join('/');
  return record;
}

function formatNumber(record) {
  const re = /,/;
  record.Bedrag = record.Bedrag.replace(re, '.');
  return record;
}

function formatRecord(record) {
  return `${record.Datum} (#${record.Nummer}) ${record.Debiteur}
    Assets:Receivable:${record.Account}    ${record.Bedrag}
    Income:behandeling:${record.Account}`

}


function main() {
  const tablewithaccount = table.map(selectAccount).map(formatDate).map(formatNumber).map(formatRecord)
  console.log(tablewithaccount.join('\n\n'))
}

module.exports = main;

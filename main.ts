const BOOLEANS = {
  "true": true,
  "false": false,
};

const DEFAULT_DELIMITER = ",";

function isQuote(value: string) {
  return value === '"';
}

function isQuoteEscaped(str: string, quoteIndex: number) {
  return isQuote(str[quoteIndex - 1]) && !isQuote(str[quoteIndex - 2]);
}

function parseNumber(value: string) {
  const startsWithZero =
    value.length > 1 && value[0] === "0" && value[1] !== ".";

  return startsWithZero || isNaN(Number(value)) ? null : Number(value);
}

function parseString(value: string) {
  return value.replace(/^"|"$/g, "").split('""').join('"');
}

function parseValue(value: string): boolean | number | string {
  return (
    BOOLEANS[value as keyof typeof BOOLEANS] ??
    parseNumber(value) ??
    parseString(value)
  );
}

function parseRow(row: string, delimiter: string) {
  const rowWithDelimiter = row + delimiter;

  const values: (string | boolean | number)[] = [];

  let valueStartIndex = 0;
  let delimiterIndex = rowWithDelimiter.indexOf(delimiter);

  while (delimiterIndex !== -1) {
    if (isQuote(rowWithDelimiter[valueStartIndex])) {
      for (let i = valueStartIndex + 1; i < rowWithDelimiter.length; i++) {
        const isClosingQuote =
          isQuote(rowWithDelimiter[i]) &&
          !isQuoteEscaped(rowWithDelimiter, i) &&
          rowWithDelimiter[i + 1] === delimiter;

        if (isClosingQuote) {
          delimiterIndex = i + 1;
          break;
        }

        delimiterIndex = i;
      }
    }

    const value = rowWithDelimiter.substring(valueStartIndex, delimiterIndex);
    values.push(parseValue(value));

    valueStartIndex = delimiterIndex + 1;
    delimiterIndex = rowWithDelimiter.indexOf(delimiter, delimiterIndex + 1);
  }

  return values;
}

export function parseCsv(
  csvString: string,
  delimiter: string = DEFAULT_DELIMITER
) {
  if (!csvString) {
    return [[]];
  }

  return csvString.split("\n").map((row) => parseRow(row, delimiter));
}

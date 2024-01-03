import { it } from "node:test";
import assert from "node:assert";
import { parseCsv } from "./main";

const csvStringMock = `Username,Identifier,First name,Last name
booker12,9012,Rachel, Booker
123, 0, -123, 0.56
true,false,true,false
abc,String with spaces, String with start-end spaces , 0123
"abc","String with spaces"," String with start-end spaces "," 0123"
"smith79, 123"," another, one ",",,,,","a,b,c"
"smith79 "","" 123",""another""","1""2""3","1""2"`;

it("returns [[]] for empty string", () => {
  assert.deepEqual(parseCsv(""), [[]]);
});

it("returns correct amount of rows", () => {
  const rowsLength = parseCsv(csvStringMock).length;
  assert.equal(rowsLength, 8);
});

it("splits row into values by comma", () => {
  const parsed = parseCsv(csvStringMock);
  const firstRowLength = parsed[0].length;

  assert.equal(firstRowLength, 4);
});

it("Parses numbers correctly", () => {
  const numbers = parseCsv(`123,0,-123,0.56`);
  assert.deepEqual(numbers, [[123, 0, -123, 0.56]]);
});

it("Parses booleans correctly", () => {
  const parsed = parseCsv(`true,false`);

  assert.deepEqual(parsed, [[true, false]]);
});

it("Parses strings without quotes correctly", () => {
  const parsed = parseCsv(
    `abc,String with spaces, String with start-end spaces , 0123`
  );

  assert.deepEqual(parsed, [
    ["abc", "String with spaces", " String with start-end spaces ", " 0123"],
  ]);
});

it("Removes quotes from strings", () => {
  const parsed = parseCsv(
    `"0","String with spaces"," String with start-end spaces "," 0123"`
  );

  assert.deepEqual(parsed, [
    ["0", "String with spaces", " String with start-end spaces ", " 0123"],
  ]);
});

it("Handles strings with commas", () => {
  const parsed = parseCsv(`"smith79, 123"," another, one ",",,,,","a,b,c"`);

  assert.deepEqual(parsed, [
    ["smith79, 123", " another, one ", ",,,,", "a,b,c"],
  ]);
});

it("Handles escape quotes in strings", () => {
  const parsed = parseCsv(`"smith79 "","" 123",""another""",1""2""3,"1""2"`);

  assert.deepEqual(parsed, [['smith79 "," 123', '"another"', '1"2"3', '1"2']]);
});

it("Handles additional separator", () => {
  const parsed = parseCsv(`Username;Identifier;First, name;Last name`, ";");

  assert.deepEqual(parsed, [
    ["Username", "Identifier", "First, name", "Last name"],
  ]);
});

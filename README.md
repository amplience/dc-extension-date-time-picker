# dc-extension-date-time-picker

[![Amplience Dynamic Content](media/header.png)](https://amplience.com/dynamic-content)

## Features

The extension can operate as just a date picker, time picker or both depending on what is chosen as the format. Additionally the picker can output a `string` or `number`.

### String output

If the schema field is defined as a string type, depending on the chosen format the output will be one of the three below:

- `date-time` - the whole [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) output.
- `date` - Will output `YYYY-MM-DD` (the part **before** the `T` in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)).
- `time` - Will output `hh:mm:ss.sss` plus the offset (the part **after** the `T` in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)).

### Number output

If the schema field is defined as a number type all formats will output a timestamp that represents the number of milliseconds from 01/01/1970.

**Note: this isn't a UNIX timestamp but can be easily converted to one by dividing by 1000**.

- `date-time` - Will output the timestamp with the milliseconds rounded to the nearest second.
- `date` - Will output the timestamp with the time rounded to `00:00:00`.
- `time` - Will output the timestamp as if the date is `01/01/1970`.

## Example usage

```json
"properties": {
  "date": {
    "title": "Just date",
    "type": "string",
    "format": "date",
    "ui:extension": {
      "url": "https://date-time.extensions.content.amplience.net/"
    }
  },
  "time": {
    "title": "Just time",
    "type": "string",
    "format": "time",
    "ui:extension": {
      "url": "https://date-time.extensions.content.amplience.net/"
    }
  },
  "both": {
    "title": "Both",
    "type": "string",
    "format": "date-time",
    "ui:extension": {
      "url": "https://date-time.extensions.content.amplience.net/"
    }
  },
  "date-timestamp": {
    "title": "Just date (timestamp)",
    "type": "number",
    "format": "date",
    "ui:extension": {
      "url": "https://date-time.extensions.content.amplience.net/"
    }
  },
  "time-timestamp": {
    "title": "Just time (timestamp)",
    "type": "number",
    "format": "time",
    "ui:extension": {
      "url": "https://date-time.extensions.content.amplience.net/"
    }
  },
  "both-timestamp": {
    "title": "Both (timestamp)",
    "type": "number",
    "format": "date-time",
    "ui:extension": {
      "url": "https://date-time.extensions.content.amplience.net/"
    }
  }
}
```

## Formatting output

Using JavaScript it is easy to convert the output of the extension into a date object and format it any way you need:

```javascript
// for all formats apart from string time only format
const date = new Date(content.body.date);
console.log(date.toLocaleDateString());

// for the string time only format you need to prepend a date in YYYY-MM-DD format with a T seperator
const date = new Date('2021-08-16T' + content.body.time);
console.log(date.toLocaleDateString());
```

If you want to use the timestamp as a UNIX timestamp, you just need to divide it by 1000.

```javascript
const unixTimestamp = content.body['time-timestamp'] / 1000;
```

## How to build

Install the dependencies...

```bash
npm ci
```

To build a version of the app:

```bash
npm run build
```

## Running tests

```bash
npm run test
```

## How to run locally

```bash
npm run start
```

Opens http://localhost:8080 to view it in the browser.

## How to run locally over https

```bash
npm run start:secure
```

Same as `npm start` (runs the app in development mode).
Opens https://localhost:8080 to view it in the browser.

To run the mode you will need to [generate a ssl certificate (snowpack.key and snowpack.crt)](https://www.snowpack.dev/#https%2Fhttp2)
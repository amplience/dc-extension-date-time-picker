# dc-extension-date-time-picker
## Features

The extension can operate as just a date picker, time picker or both depending on what is chosen as the format. Additionally the picker can output a `string` or `number`. All dates and times will be output as UTC, with no local offsets.

## String output

If the schema field is defined as a string type, dates and times are represented in [RFC 3339, section 7.3.1](https://json-schema.org/draft/2020-12/json-schema-validation.html#rfc.section.7.3.1). This is a subset of the date format also commonly known as [ISO8601 format](https://www.iso.org/iso-8601-date-and-time-format.html).

### Formats

- **date-time** - Will output `YYYY-MM-DDThh:mm:ss.sss`. Example: `2020-01-01T12:00:00.000Z`.
- **date** - Will output `YYYY-MM-DD`, this is the part **before** the `T` in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601). Example: `2020-01-01`.
- **time** - Will output `hh:mm:ss.sss` plus the UTC offset character (Z). This is the part **after** the `T` in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601). Example: `12:00:00.000Z`.

## Number output

If the schema field is defined as a number type all formats will output a timestamp that represents the number of milliseconds from 01/01/1970. To make this a Unix timestamp (so it's seconds from 01/01/1970) you can set the `unix` parameter in your extension.

### Timestamps

Timestamps will always have both date and time information baked into them. In the case of a `date` format time will be set to `00:00:00.000`. In the case of `time` the date selected will be set to `1970/01/1`.

### Params

```json
{
  "unix": true // makes the timestamp use seconds not milliseconds
}
```

### Formats

- `date-time` - Will output the timestamp with the milliseconds set to 0. Example: `1577880000000`.
- `date` - Will output the timestamp with the time set to `00:00:00.000`. Example: `1577836800000`.
- `time` - Will output the timestamp as if the date is `01/01/1970`. Example: `43200000`.

## Example usage

```json
"properties": {
  "date": {
    "title": "Just date",
    "type": "string",
    "format": "date",
    "ui:extension": {
      "url": "https://date-time-picker.extensions.content.amplience.net"
    }
  },
  "time": {
    "title": "Just time",
    "type": "string",
    "format": "time",
    "ui:extension": {
      "url": "https://date-time-picker.extensions.content.amplience.net"
    }
  },
  "both": {
    "title": "Both",
    "type": "string",
    "format": "date-time",
    "ui:extension": {
      "url": "https://date-time-picker.extensions.content.amplience.net"
    }
  },
  "date-timestamp": {
    "title": "Just date (timestamp)",
    "type": "number",
    "format": "date",
    "ui:extension": {
      "url": "https://date-time-picker.extensions.content.amplience.net"
    }
  },
  "time-timestamp": {
    "title": "Just time (timestamp)",
    "type": "number",
    "format": "time",
    "ui:extension": {
      "url": "https://date-time-picker.extensions.content.amplience.net"
    }
  },
  "both-timestamp": {
    "title": "Both (timestamp)",
    "type": "number",
    "format": "date-time",
    "ui:extension": {
      "url": "https://date-time-picker.extensions.content.amplience.net"
    }
  },
  "unix": {
    "title": "Unix",
    "type": "number",
    "format": "date-time",
    "ui:extension": {
      "url": "https://date-time-picker.extensions.content.amplience.net",
      "params": {
        "unix": true
      }
    }
  }
}
```

## Formatting output

Using JavaScript it is easy to convert the output of the extension into a date object and format it any way you need:

```javascript
// for most formats
const date = new Date(content.body.date);
console.log(date.toLocaleDateString());

// for the string type with time only format you need to prepend a date in YYYY-MM-DD format with a T seperator
const date = new Date('2021-08-16T' + content.body.time);
console.log(date.toLocaleDateString());

// for the unix timestamps you need to multiply by 1000
const date = new Date(content.body.unix * 1000);
console.log(date.toLocaleDateString());
```

## How to build

This project requires Node 16.x or 18.x to build. Tested with Node 16.16.0, NPM 8.11.0.

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
npm test
```

## How to run locally

```bash
npm start
```

Opens http://localhost:8080 to view it in the browser.

## How to run locally over https

```bash
npm run start:secure
```

Same as `npm start` (runs the app in development mode).
Opens https://localhost:8080 to view it in the browser.

To run the mode you will need to [generate a ssl certificate (snowpack.key and snowpack.crt)](https://www.snowpack.dev/#https%2Fhttp2)

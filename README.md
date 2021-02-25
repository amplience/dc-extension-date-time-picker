# dc-extension-date-time-picker

[![Amplience Dynamic Content](media/header.png)](https://amplience.com/dynamic-content)

## Features

The extension can operate as just a date picker, time picker or both depending on what is chosen as the format. Additionally the picker can output a `string` or `number`.

## String output

If the schema field is defined as a string type, all formats will use [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) as its base.

### Formats

- `date-time` - the whole [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) output.
- `date` - Will output `YYYY-MM-DD` (the part **before** the `T` in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)).
- `time` - Will output `hh:mm:ss.sss` plus the offset (the part **after** the `T` in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)).

## Number output

If the schema field is defined as a number type all formats will output a timestamp that represents the number of milliseconds from 01/01/1970. To make this a Unix timestamp (so it's seconds from 01/01/1970) you can set the `unix` parameter in your extension.

### Time zones and timestamps

It's worth noting that timestamps will always have time information baked into them which is subject to time zone differences. So if you're using a timestamp in combination with just a date selector if you're in +1 GMT for example 01/01/2021 00:00:00 will be the timestamp `1609455600`. That timestamp will be 31/12/2020 23:00:00 in GMT. This means your date would be different depending on where the final date is rendered.

### Params

```json
{
  "unix": true // makes the timestamp use seconds not milliseconds
}
```

### Formats

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
  },
  "unix": {
    "title": "Unix",
    "type": "number",
    "format": "date-time",
    "ui:extension": {
      "url": "https://date-time.extensions.content.amplience.net/",
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

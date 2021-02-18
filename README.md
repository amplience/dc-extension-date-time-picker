# dc-extension-date-time

## Features

The extension can operate as just a date picker, time picker or both depending on what is chosen as the format. Additionally the picker can output a `string` or `number`.

### String output

If the schema field is defined as a string type, depending on the chosen format the output will be one of the three below:

- `date` - Will output `YYYY-MM-DD` (the part **before** the `T` in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601))
- `time` - Will output `hh:mm:ss.sss` plus the offset (the part **after** the `T` in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601))
- `date-time` - the whole [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) output.

### Number output

If the schema field is defined as a number type all formats will output a timestamp that represents the number of milliseconds from 01/01/1970.

**Note: this isn't a UNIX timestamp but can be easily converted to one by dividing by 1000**.

- `date` - Will output the timestamp with the time rounded to `00:00:00`.
- `time` - Will output the timestamp as if the date is `01/01/1970`.
- `date-time` - Will output the timestamp that represents the number of milliseconds from 01/01/1970, with the milliseconds rounded to the nearest second.

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
    "type": "string",
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
const date = new Date(content.body.date);
console.log(date.toLocaleDateString());
```

If you want to use the timestamp as a UNIX timestamp, you just need to divide it by 1000.

```javascript
const unixTimestamp = content.body['time-timestamp'] / 1000;
```

## Get started

Install the dependencies...

```bash
cd svelte-app
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Heroku](https://heroku.com).

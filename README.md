# date-time-extension

*NON-OFFICIAL NON-SUPPORTED UI EXTENSION*

## Features
* Can operate as just a date picker, time picker or both. Utilising what is chosen as the format (Draft 7 formats support `date`, `time` and `date-time`).

* Should give region specific rendering of date and time as it makes use of `toLocaleDateString()` and `toLocaleTimeString()`.
​
* Will be converted to UTC meaning local time zone offset is baked into saved value.

## Future improvements
* Default date-time is always current system date-time. We could probably tweak this to be configurable.

* Make the start day of the week configurable (i.e. allow it to start with Sunday instead of Monday).

* Take into account in-app time zone settings (not possible with current dc-app functionality).

## Example usage:

    "properties": {
      "date": {
        "title": "Just date",
        "description": "description",
        "type": "string",
        "format": "date",
        "ui:extension": {
          "url": "https://dev-chris.s3-eu-west-1.amazonaws.com/uiex/date-picker/index.html",
          "params": {
            "default": "today"
          }
        }
      },
      "time": {
        "title": "Just time",
        "description": "description",
        "type": "string",
        "format": "time",
        "ui:extension": {
          "url": "https://dev-chris.s3-eu-west-1.amazonaws.com/uiex/date-picker/index.html"
        }
      },
      "both": {
        "title": "Both",
        "description": "description",
        "type": "string",
        "format": "date-time",
        "ui:extension": {
          "url": "https://dev-chris.s3-eu-west-1.amazonaws.com/uiex/date-picker/index.html"
        }
      }
    }
​


## Get started

Install the dependencies...

```bash
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

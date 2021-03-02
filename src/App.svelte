<script>
  import { init } from 'dc-extensions-sdk';
  import { fly } from 'svelte/transition';
  import { offsetMinutesToString, pad } from './utils';
  import Calendar from './components/Calendar.svelte';
  import Clock from './components/Clock.svelte';
  let date = '1970-01-01';
  let time = '00:00:00';
  let editingDate = false;
  let editingTime = false;
  let type = 'string';
  let format = 'date-time';
  let showDate = true;
  let showTime = true;
  let unixMode = false;
  let sdk;

  (async () => {
    try {
      sdk = await init();
      sdk.frame.startAutoResizer();
      unixMode = sdk.params.installation.unix || sdk.params.instance.unix;
      type = sdk.field.schema.type;
      setState(sdk.field.schema.format);
      const value = await sdk.field.getValue();
      if (type === 'string') {
        processStringInput(value);
      } else if (type === 'number') {
        processNumberInput(value);
      }
    } catch {}
  })();

  function processStringInput(input) {
    if (!input) {
      return;
    }
    switch (format) {
      case 'date-time':
        [date, time] = input.split('T');
        break;
      case 'date':
        date = input;
        break;
      case 'time':
        time = input;
        break;
    }
    time = time.substr(0, 8);
  }

  function getNegativeLocalOffset() {
    return 0 - getLocalOffset();
  }

  function getLocalOffset() {
    return new Date(dateString(date, time)).getTimezoneOffset();
  }

  function processNumberInput(input) {
    if (!input) {
      return;
    }
    let stamp = unixMode ? input * 1000 : input;
    let d = new Date(stamp);
    let offset = d.getTimezoneOffset();
    date =
      pad(d.getFullYear()) +
      '-' +
      pad(d.getMonth() + 1) +
      '-' +
      pad(d.getDate());
    time =
      pad(d.getHours() + Math.floor(offset / 60)) +
      ':' +
      pad(d.getMinutes() + (offset % 60)) +
      ':' +
      pad(d.getSeconds());
  }

  function setState(f) {
    if (!f) {
      return;
    }
    if (f == 'time') {
      format = f;
      showDate = false;
    } else if (f == 'date') {
      format = f;
      showTime = false;
    }
  }

  function processNumberOutput() {
    let d = new Date(dateString(date, time));
    return unixMode ? d.getTime() / 1000 : d.getTime();
  }

  function dateString(d, t, offset) {
    let ds = '';
    if (offset !== undefined) {
      ds = d + 'T' + t + '.000' + offset;
    } else {
      ds = d + 'T' + t + '.000Z';
    }
    return ds;
  }

  function processStringOutput() {
    switch (format) {
      case 'date-time':
        return dateString(date, time);
      case 'date':
        return date;
      case 'time':
        return time;
    }
  }
  function update() {
    let val;
    if (type === 'string') {
      val = processStringOutput();
    } else if (type === 'number') {
      val = processNumberOutput();
    }
    if (sdk && val) {
      sdk.field.setValue(val);
    }
  }

  function toggle(component) {
    if (component === 'date') {
      if (editingDate) {
        editingDate = false;
      } else {
        editingDate = true;
        editingTime = false;
      }
    }
    if (component === 'time') {
      if (editingTime) {
        editingTime = false;
      } else {
        editingTime = true;
        editingDate = false;
      }
    }
  }
</script>

<main>
  {#if sdk && sdk.field && sdk.field.schema && sdk.field.schema.title}
    <div class="label">
      <p>{sdk.field.schema.title}:</p>
    </div>
  {/if}
  {#if showDate}
    <div class="date" on:click={() => toggle('date')}>
      <img src="./icons/calendar.svg" alt="calendar icon" />
      <p>
        {new Date(
          dateString(
            date,
            time,
            offsetMinutesToString(getNegativeLocalOffset())
          )
        ).toLocaleDateString()}
      </p>
    </div>
  {/if}
  {#if showTime}
    <div class="time" on:click={() => toggle('time')}>
      <img src="./icons/clock.svg" alt="calendar icon" />
      <p>
        {new Date(
          dateString(
            date,
            time,
            offsetMinutesToString(getNegativeLocalOffset())
          )
        ).toLocaleTimeString()}
      </p>
    </div>
  {/if}
  <div class="clear" />
  {#if editingDate}
    <div class="editor" in:fly={{ x: -500, duration: 500 }}>
      <Calendar
        {date}
        on:hide={() => (editingDate = false)}
        on:update={(d) => (date = d.detail) && update()}
      />
    </div>
  {/if}
  {#if editingTime}
    <div class="editor" in:fly={{ x: -500, duration: 500 }}>
      <Clock
        {time}
        on:hide={() => (editingTime = false)}
        on:update={(d) => (time = d.detail) && update()}
      />
    </div>
  {/if}
  <div class="clear" />
</main>

<style>
  img {
    height: 2em;
  }

  p {
    text-decoration: underline;
    height: 2em;
    line-height: 2em;
    padding: 0;
    margin: 0;
  }

  img {
    padding-right: 0.25em;
  }

  img,
  p {
    float: left;
  }

  .date,
  .time,
  .label {
    display: inline-block;
    margin: 0.25em;
    cursor: pointer;
  }

  .label p {
    text-decoration: none;
    cursor: default;
  }
  .clear {
    clear: both;
  }

  main {
    overflow: hidden;
  }
</style>

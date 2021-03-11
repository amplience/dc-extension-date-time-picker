<script>
  import { init } from 'dc-extensions-sdk';
  import { fly } from 'svelte/transition';
  import { offsetMinutesToString, pad } from './utils';
  import Calendar from './components/Calendar.svelte';
  import Clock from './components/Clock.svelte';
  const now = new Date();
  let date = nowDate();
  let time = nowTime();
  let editingDate = false;
  let editingTime = false;
  let type = 'string';
  let format = 'date-time';
  let showDate = true;
  let showTime = true;
  let unixMode = false;
  let active = false;
  let sdk;

  (async () => {
    try {
      sdk = await init();
      sdk.frame.startAutoResizer();
      unixMode = sdk.params.installation.unix || sdk.params.instance.unix;
      type = sdk.field.schema.type;
      setState(sdk.field.schema.format);
      const value = await sdk.field.getValue();
      if (value === undefined) {
        setDefaults();
      } else {
        active = true;
      }
      if (type === 'string') {
        processStringInput(value);
      } else if (type === 'number') {
        processNumberInput(value);
      }
    } catch {}
  })();

  function setDefaults() {
    switch (format) {
      case 'date':
        time = '00:00:00';
        break;
      case 'time':
        date = '1970-01-01';
        break;
    }
  }
  function nowDate() {
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )}`;
  }

  function nowTime() {
    return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(
      now.getSeconds()
    )}`;
  }

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
    if (input === undefined || input === null || isNaN(input)) {
      return;
    }
    let stamp = unixMode ? input * 1000 : input;
    let d = new Date(stamp);
    let offset = d.getTimezoneOffset();
    time = calculateTime(d, offset);
    date =
      pad(d.getFullYear()) +
      '-' +
      pad(d.getMonth() + 1) +
      '-' +
      pad(d.getDate());
  }

  function calculateTime(d, offset) {
    const offsetInHours = Math.trunc(offset / 60);
    const remainingOffset = offset % 60;
    let offsetHours = d.getHours() + offsetInHours;
    let offsetMinutes = d.getMinutes() + remainingOffset;
    if (offsetMinutes < 0) {
      offsetHours--;
      offsetMinutes = 60 + offsetMinutes;
    } else if (offsetMinutes > 59) {
      offsetHours++;
      offsetMinutes = offsetMinutes % 60;
    }
    if (offsetHours < 0) {
      d.setDate(d.getDate() - 1);
      offsetHours = 24 + offsetHours;
    } else if (offsetHours > 23) {
      d.setDate(d.getDate() + 1);
      offsetHours = offsetHours % 24;
    }
    return `${pad(offsetHours)}:${pad(offsetMinutes)}:${pad(d.getSeconds())}`;
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
        return time + '.000Z';
    }
  }
  function update() {
    let val;
    if (type === 'string') {
      val = processStringOutput();
    } else if (type === 'number') {
      val = processNumberOutput();
    }
    active = true;
    if (sdk && val !== undefined) {
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
      <p class={active ? 'active' : ''}>
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
      <p class={active ? 'active' : ''}>
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

  .date p,
  .time p {
    color: #999;
  }

  p.active {
    color: #333;
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

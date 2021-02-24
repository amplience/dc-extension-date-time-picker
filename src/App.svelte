<script>
  import { init } from 'dc-extensions-sdk';
  import { fly } from 'svelte/transition';
  import Calendar from './components/Calendar.svelte';
  import Clock from './components/Clock.svelte';

  let date = new Date();
  date.setMilliseconds(0);
  let editingDate = false;
  let editingTime = false;
  let type = 'string';
  let format = 'date-time';
  let showDate = true;
  let showTime = true;
  let sdk;

  (async () => {
    try {
      sdk = await init();
      sdk.frame.startAutoResizer();
      type = sdk.field.schema.type;
      setState(sdk.field.schema.format);
      const d = await sdk.field.getValue();
      if (d && (format === 'date-time' || type === 'number')) {
        date = new Date(d);
      } else if (d && format === 'date') {
        date = new Date(d + 'T00:00:00');
      } else if (d && format === 'time') {
        date = new Date('1970-01-01T' + d);
      } else if (type === 'number' && format === 'time') {
        date.setDate(1);
        date.setMonth(0);
        date.setYear(1970);
      } else if (type === 'number' && format === 'date') {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
      }
    } catch {}
  })();

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

  function processString() {
    let str = date.toISOString();
    if (format !== 'date-time') {
      let split = str.split('T');
      if (format === 'date') {
        str = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          '0'
        )}-${String(date.getDate()).padStart(2, '0')}`;
      } else if (format === 'time') {
        str = split[1];
      }
    }
    return str;
  }
  function update(change) {
    date = change;
    let val;
    if (type === 'string') {
      val = processString();
    } else if (type === 'number') {
      val = Number(date.getTime());
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
      <p>{date.toLocaleDateString()}</p>
    </div>
  {/if}
  {#if showTime}
    <div class="time" on:click={() => toggle('time')}>
      <img src="./icons/clock.svg" alt="calendar icon" />
      <p>{date.toLocaleTimeString()}</p>
    </div>
  {/if}
  <div class="clear" />
  {#if editingDate}
    <div class="editor" in:fly={{ x: -500, duration: 500 }}>
      <Calendar
        {date}
        on:hide={() => (editingDate = false)}
        on:update={(d) => update(d.detail)}
      />
    </div>
  {/if}
  {#if editingTime}
    <div class="editor" in:fly={{ x: -500, duration: 500 }}>
      <Clock
        {date}
        on:hide={() => (editingTime = false)}
        on:update={(d) => update(d.detail)}
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

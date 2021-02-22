<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  export let date;

  const dispatch = createEventDispatcher();
  let hour = date.getHours() ? date.getHours() : 24;
  let minute = date.getMinutes();
  let seconds = date.getSeconds();
  let hourIndex = hour % 12;
  let size = hour > 12 ? -20 : -35;
  let selection = 'hour';
  let hourCoords = generateCoords(30, -40);
  let hourMinorCoords = generateCoords(30, -25);
  let minuteCoords = generateCoords(6, -40);

  function indexToHour(i) {
    return i === 0 ? 12 : i === 12 ? 24 : i;
  }
  function generateCoords(inc, length) {
    let coords = [];
    for (let i = 0; i < 360 / inc; i++) {
      let degree = i * inc + 90;
      let degreeRad = (degree * Math.PI) / 180;
      let y = Math.sin(degreeRad) * length;
      let x = Math.cos(degreeRad) * length;
      coords.push({ x, y });
    }
    return coords;
  }

  function setHour(h) {
    hour = h;
    hourIndex = h % 12;
    size = h > 12 ? -20 : -35;
    const day = date.getDate();
    date.setHours(h);
    date.setDate(day);
    setDate();
  }
  function setMinute(m) {
    minute = m;
    date.setMinutes(m);
    setDate();
  }
  function setSeconds(s) {
    seconds = s;
    date.setSeconds(s);
    setDate();
  }
  function setDate() {
    dispatch('update', date);
  }
</script>

<svg class="clock" viewBox="-50 -50 100 100">
  <circle class="clock-face" r="48" />

  {#if selection === 'hour'}
    <line class="line" y1="0" y2={size} transform="rotate({30 * hourIndex})" />
    <g transition:fade|local>
      {#each hourCoords as coord, i}
        <g
          on:mouseup={() => (selection = 'minute')}
          on:mouseover={() => {
            setHour(indexToHour(i));
          }}
          on:mousedown={() => {
            setHour(indexToHour(i));
          }}
          class={indexToHour(i) === hour ? 'selected' : ''}
        >
          <circle r="6" cx={coord.x} cy={coord.y} class="hourCircle" />
          <svg x={coord.x - 10} y={coord.y - 4} width="20" height="10">
            <text
              class="label"
              x="50%"
              y="50%"
              dominant-baseline="middle"
              text-anchor="middle"
            >
              {indexToHour(i)}
            </text>
          </svg>
        </g>
      {/each}

      {#each hourMinorCoords as coord, i}
        <g
          on:mouseup={() => (selection = 'minute')}
          on:mouseover={() => {
            setHour(indexToHour(i + 12));
          }}
          on:mousedown={() => {
            setHour(indexToHour(i + 12));
          }}
          class={indexToHour(i + 12) === hour ? 'selected' : ''}
        >
          <circle class="hourCircle" cx={coord.x} cy={coord.y} r="6" />
          <svg x={coord.x - 10} y={coord.y - 4} width="20" height="10">
            <text
              class="label-inner"
              x="50%"
              y="50%"
              dominant-baseline="middle"
              text-anchor="middle"
            >
              {indexToHour(i + 12)}
            </text>
          </svg>
        </g>
      {/each}
      <text
        class="title"
        dominant-baseline="middle"
        text-anchor="middle"
        paint-order="stroke"
      >
        Hour
      </text>
    </g>
  {:else if selection === 'minute'}
    <g transition:fade|local class="mins">
      {#each minuteCoords as coord, i}
        {#if i % 5 === 0}
          <g>
            <circle class="hourCircle" cx={coord.x} cy={coord.y} r="6" />
            <svg x={coord.x - 10} y={coord.y - 4} width="20" height="10">
              <text
                class="label show"
                x="50%"
                y="50%"
                dominant-baseline="middle"
                text-anchor="middle"
              >
                {i}
              </text>
            </svg>
          </g>
        {/if}
      {/each}
      {#each minuteCoords as coord, i}
        {#if i === minute}
          <g class="selected">
            <circle class="hourCircle" cx={coord.x} cy={coord.y} r="6" />
            <svg x={coord.x - 10} y={coord.y - 4} width="20" height="10">
              <text
                class={i % 5 === 0 ? 'label show' : 'label'}
                x="50%"
                y="50%"
                dominant-baseline="middle"
                text-anchor="middle"
              >
                {i}
              </text>
            </svg>
          </g>
        {/if}
      {/each}

      <line class="line" y1="0" y2="-35" transform="rotate({6 * minute})" />
      <text
        class="title"
        dominant-baseline="middle"
        text-anchor="middle"
        paint-order="stroke"
      >
        Minutes
      </text>
      {#each minuteCoords as coord, i}
        <path
          on:mouseup={() => (selection = 'seconds')}
          on:mouseover={() => {
            setMinute(i);
          }}
          on:mousedown={() => {
            setMinute(i);
          }}
          class="hit"
          d="M 0 0 L -2 -47 L 2 -47 Z"
          transform="rotate({6 * i})"
        />
      {/each}
    </g>
  {:else}
    <g transition:fade|local class="mins">
      {#each minuteCoords as coord, i}
        {#if i % 5 === 0}
          <g>
            <circle class="hourCircle" cx={coord.x} cy={coord.y} r="6" />
            <svg x={coord.x - 10} y={coord.y - 4} width="20" height="10">
              <text
                class="label show"
                x="50%"
                y="50%"
                dominant-baseline="middle"
                text-anchor="middle"
              >
                {i}
              </text>
            </svg>
          </g>
        {/if}
      {/each}
      {#each minuteCoords as coord, i}
        {#if i === seconds}
          <g class="selected">
            <circle class="hourCircle" cx={coord.x} cy={coord.y} r="6" />
            <svg x={coord.x - 10} y={coord.y - 4} width="20" height="10">
              <text
                class={i % 5 === 0 ? 'label show' : 'label'}
                x="50%"
                y="50%"
                dominant-baseline="middle"
                text-anchor="middle"
              >
                {i}
              </text>
            </svg>
          </g>
        {/if}
      {/each}
      <line class="line" y1="0" y2="-35" transform="rotate({6 * seconds})" />
      <text
        class="title"
        dominant-baseline="middle"
        text-anchor="middle"
        paint-order="stroke"
      >
        Seconds
      </text>
      {#each minuteCoords as coord, i}
        <path
          on:click={() => dispatch('hide')}
          on:mouseover={() => {
            setSeconds(i);
          }}
          class="hit"
          d="M 0 0 L -2 -47 L 2 -47 Z"
          transform="rotate({6 * i})"
        />
      {/each}
    </g>
  {/if}
</svg>

<style>
  .clock {
    width: 100%;
    height: 100%;
    max-width: 20em;
  }

  circle {
    stroke-width: 0.1;
  }

  svg text {
    transform-origin: 50% 50%;
  }

  .label {
    font-size: 0.5em;
  }
  .label-inner {
    font-size: 0.25em;
  }

  .clock-face {
    stroke: #555;
    fill: white;
  }

  .hourCircle,
  .hit {
    stroke: transparent;
    fill: transparent;
    cursor: pointer;
  }
  g.mins text {
    fill: transparent;
  }
  g.mins text.show {
    fill: black;
  }
  g.selected .hourCircle {
    fill: #00acc1;
  }

  g.selected text,
  g.selected text.show {
    fill: white;
  }
  g .hourCircle,
  g text {
    cursor: pointer;
  }
  .line {
    stroke: #00acc1;
    stroke-width: 2;
  }
  g.mins text.title,
  text.title {
    fill: black;
    stroke: white;
  }
</style>

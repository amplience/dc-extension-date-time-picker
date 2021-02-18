<script>
  import { createEventDispatcher } from 'svelte';
  export let date;

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const dispatch = createEventDispatcher();

  function addYear() {
    setDate(new Date(date.setFullYear(date.getFullYear() + 1)));
  }
  function subtractYear() {
    setDate(new Date(date.setFullYear(date.getFullYear() - 1)));
  }

  function addMonth() {
    setDate(new Date(date.setMonth(date.getMonth() + 1)));
  }
  function subtractMonth() {
    setDate(new Date(date.setMonth(date.getMonth() - 1)));
  }

  function setDate(d) {
    dispatch('update', d);
  }

  function americanDayToBritishDay(num) {
    num -= 1;
    if (num < 0) {
      num = 6;
    }
    return num;
  }

  function startDayOfMonth(d) {
    let nd = new Date(d);
    nd.setDate(1);
    return americanDayToBritishDay(nd.getDay());
  }

  function daysInMonth(date) {
    let d = new Date(date);
    return new Date(d.getYear(), d.getMonth() + 1, 0).getDate();
  }

  function generateArray(length) {
    return Array.apply(null, Array(length)).map(function () {});
  }

  function setDay(day) {
    let d = new Date(date);
    d.setDate(day + 1);
    setDate(d);
    dispatch('hide');
  }

  $: day = generateArray(startDayOfMonth(date));
  $: days = generateArray(daysInMonth(date));
</script>

<div class="grid-container">
  <div class="year">
    <div on:click={subtractYear}>&leftarrow;</div>
    <p class="yearText">{date.getFullYear()}</p>
    <div on:click={addYear}>&rightarrow;</div>
  </div>
  <div class="month">
    <div on:click={subtractMonth}>&leftarrow;</div>
    <p class="monthText">{months[date.getMonth()]}</p>
    <div on:click={addMonth}>&rightarrow;</div>
  </div>
  <div class="date">
    <p class="day">M</p>
    <p class="day">T</p>
    <p class="day">W</p>
    <p class="day">T</p>
    <p class="day">F</p>
    <p class="day">S</p>
    <p class="day">S</p>
    {#each day as d, i}
      <p />
    {/each}
    {#each days as dai, i}
      <p
        class={date.getDate() - 1 === i ? 'selected' : ''}
        on:click={() => setDay(i)}
      >
        {i + 1}
      </p>
    {/each}
  </div>
</div>

<style>
  * {
    text-align: center;
    color: #333;
  }

  p {
    margin: 0;
  }
  .date {
    text-align: center;
  }
  .date p {
    width: 100%;
    text-align: center;
    cursor: pointer;
    display: inline-block;
    height: 2em;
    width: 100%;
    line-height: 2em;
  }

  .date p:hover {
    background: #eee;
  }

  .day {
    font-weight: bold;
    border-bottom: 1px solid #ddd;
  }
  .selected {
    background: #f44336;
    color: white;
    font-weight: bold;
    border-radius: 2em;
  }

  .yearText,
  .monthText {
    font-size: 1.5em;
    height: 1.5em;
    line-height: 1.5em;
  }

  .grid-container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 0.1fr 0.1fr 1fr;
    grid-template-areas: 'year' 'month' 'date';
    width: 20em;
    background: #ddd;
    grid-gap: 1px;
    border: 1px solid #ddd;
  }

  .year {
    display: grid;
    grid-template-columns: 0.5fr 1fr 0.5fr;
    grid-template-rows: 1fr;
    grid-template-areas: '. . .';
    grid-area: year;
    background: white;
  }

  .year div,
  .month div {
    background: #eee;
    color: #555;
    cursor: pointer;
    font-size: 1.5em;
    line-height: 1.5em;
  }

  .month {
    display: grid;
    grid-template-columns: 0.5fr 1fr 0.5fr;
    grid-template-rows: 1fr;
    grid-template-areas: '. . .';
    grid-area: month;
    background: white;
  }

  .date {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    grid-template-areas: '. . . . . . .' '. . . . . . .' '. . . . . . .' '. . . . . . .' '. . . . . . .';
    grid-area: date;
    background: white;
  }
</style>

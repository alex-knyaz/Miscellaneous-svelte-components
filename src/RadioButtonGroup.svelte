<script>
  export let items = [];
  export let value;
</script>

<div>
  {#each items as { l, v }}
    <label class:checked-item={value == v}>
      <input type="radio" value={v} bind:group={value} />
      {l}
    </label>
  {/each}
</div>

<style>
  div {
    overflow: hidden;
  }

  label {
    display: inline-block;
    cursor: pointer;
    padding: 0px 15px;
    line-height: 34px;
    border: 1px solid #999;
    border-right: none;
    user-select: none;
  }

  input {
    display: none;
  }

  label:first-child {
    border-radius: 6px 0 0 6px;
  }
  label:last-child {
    border-radius: 0 6px 6px 0;
    border-right: 1px solid #999;
  }

  label:hover {
    background-color: #333;
  }

  .checked-item {
    background: #555;
  }
</style>

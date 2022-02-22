<script>
  export let min = 0;
  export let max = 500;
  export let step = 1;
  export let scale = 0.05;

  export let value;
  let true_value = value;

  let handle_move = (e) => {
    true_value += e.movementX * scale * step;
    value = Math.max(Math.min(Math.round(true_value), max), min);
  };
  let handle_down = (e) => {
    e.target.setPointerCapture(e.pointerId);
    e.target.addEventListener("pointermove", handle_move);
  };
  let handle_up = (e) => {
    e.target.releasePointerCapture(e.pointerId);
    e.target.removeEventListener("pointermove", handle_move);
    true_value = value;
  };
</script>

<span on:pointerdown={handle_down} on:pointerup={handle_up}>
  {value}
</span>

<style>
  span {
    border-bottom: dotted 1px;
    cursor: col-resize;
    user-select: none;
    color: cornflowerblue;
  }
</style>

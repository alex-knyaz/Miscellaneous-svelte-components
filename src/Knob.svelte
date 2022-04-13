<script>
  export let min = 0;
  export let max = 50;
  export let step = 1;
  export let scale = 0.5;

  export let value;
  let true_value = value;

  let old_x;

  let re_scale = (val, min_old, max_old, min_new, max_new) => {
    let scaled = (val - min_old) / (max_old - min_old);
    return scaled * (max_new - min_new) + min_new;
  };

  $: display_value = re_scale(value, min, max, -150, 150);

  let handle_move = (e) => {
    let movement_x = e.screenX - old_x;
    old_x = e.screenX;
    true_value += movement_x * scale * step;
    value = Math.max(Math.min(Math.round(true_value), max), min);
  };
  let handle_down = (e) => {
    console.log("test");
    old_x = e.screenX;
    e.target.setPointerCapture(e.pointerId);
    e.target.addEventListener("pointermove", handle_move);
  };
  let handle_up = (e) => {
    old_x = 0;
    e.target.releasePointerCapture(e.pointerId);
    e.target.removeEventListener("pointermove", handle_move);
    true_value = value;
  };
</script>

<div
  class="knob_body"
  style="transform:rotate({display_value}deg)"
  on:pointerdown={handle_down}
  on:pointerup={handle_up}
>
  <div class="knob_mark" />
</div>

<style>
  .knob_body {
    width: 40px;
    height: 40px;
    background: black;
    opacity: 0.4;
    border-radius: 50%;
    outline: solid 1px lightblue;

    cursor: col-resize;
    user-select: none;
    -webkit-user-select: none;
  }

  .knob_mark {
    margin: 19px;
    width: 2px;
    height: 15px;
    background: white;
  }
</style>

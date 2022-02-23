<script>
  export let tooltip = null;
  let isHovered = false;
  let x;
  let y;

  let mouseOver = (event) => {
    isHovered = true;
    x = event.clientX + 5;
    y = event.clientY + 5;
  };
  let mouseMove = (event) => {
    x = event.clientX + 5;
    y = event.clientY + 5;
  };
  let mouseLeave = () => {
    isHovered = false;
  };

  // $: console.log()
  // [ ] window border !!!
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- @note this style of writing components is to prevent whitespace's.  -->
<span
  on:mouseover={mouseOver}
  on:mouseleave={mouseLeave}
  on:mousemove={mouseMove}
  class="wrapper"><slot /></span
>{#if isHovered}<div style="left: {x}px; top: {y}px;" class="tooltip">
    {#if !!tooltip}{tooltip}{:else}<slot name="tooltip" />{/if}
  </div>{/if}

<style>
  .wrapper {
    display: contents;
  }
  .tooltip {
    -webkit-user-select: none;
    -khtml-user-select: none;
    -ms-user-select: none;
    user-select: none;

    color: #fff;
    border: 1px solid #ddd;
    background: #333;
    padding: 4px;
    position: fixed;

    z-index: 100;
    white-space: normal;
  }
</style>

<script>
  export let scale = 1;
  export let posX = 100;
  export let posY = 100;

  $: clientW = 0;
  $: clientH = 0;

  $: wrapW = 0;
  $: wrapH = 0;

  $: minPosX = -clientW * scale + 10 * scale;
  $: minPosY = -clientH * scale + 10 * scale;

  $: maxPosX = wrapW - 10 * scale;
  $: maxPosY = wrapH - 10 * scale;

  let bound = (v, min_val, max_val) => Math.min(Math.max(v, min_val), max_val);

  const minScale = 0.5;
  const scaleStep = 0.01;

  let willChange = false;
  let timer;
  const wheel = (e) => {
    willChange = true;
    clearTimeout(timer);

    timer = setTimeout(() => {
      willChange = false;
    }, 250);

    // HACK
    var isTouchPad = e.wheelDeltaY
      ? e.wheelDeltaY === -3 * e.deltaY
      : e.deltaMode === 0;

    if (e.ctrlKey || !isTouchPad) {
      let rect = e.currentTarget.getBoundingClientRect();

      let mouseX = e.clientX - rect.left - posX;
      let mouseY = e.clientY - rect.top - posY;

      let delta = e.deltaY * scaleStep;
      let newscale = scale - delta;
      if (newscale <= minScale) {
        newscale = minScale;
      } else {
        posX += (mouseX / scale) * delta;
        posY += (mouseY / scale) * delta;
        scale = newscale;
      }
    } else {
      posX -= e.deltaX * 2;
      posY -= e.deltaY * 2;
    }

    posX = bound(posX, minPosX, maxPosX);
    posY = bound(posY, minPosY, maxPosY);
  };

  let startX = 0;
  let startY = 0;
  let wrapper;

  const pointerDown = (e) => {
    if (e.buttons == 1) {
      let rect = e.currentTarget.getBoundingClientRect();
      startX = e.clientX - rect.left - posX;
      startY = e.clientY - rect.top - posY;
    }
    wrapper.setPointerCapture(e.pointerId);
  };

  const pointerMove = (e) => {
    if (!wrapper.hasPointerCapture(e.pointerId)) return;

    willChange = true;
    clearTimeout(timer);

    timer = setTimeout(() => {
      willChange = false;
    }, 250);

    let rect = e.currentTarget.getBoundingClientRect();

    let mouseX = e.clientX - rect.left - posX;
    let mouseY = e.clientY - rect.top - posY;

    if (e.buttons == 1) {
      posX += mouseX - startX;
      posY += mouseY - startY;
    }
    posX = bound(posX, minPosX, maxPosX);
    posY = bound(posY, minPosY, maxPosY);
  };

  const pointerUp = (e) => {
    wrapper.releasePointerCapture(e.pointerId);
    willChange = false;
  };
</script>

<div
  class="wrapper"
  bind:this={wrapper}
  on:wheel|preventDefault={wheel}
  on:pointermove|preventDefault={pointerMove}
  on:pointerdown={pointerDown}
  on:pointerup={pointerUp}
  bind:clientHeight={wrapH}
  bind:clientWidth={wrapW}
>
  <div
    class="client"
    style="{willChange
      ? 'will-change: transform;'
      : ''} -webkit-transform: translate({posX}px,
	  {posY}px) scale({scale});"
    bind:clientHeight={clientH}
    bind:clientWidth={clientW}
  >
    <slot />
  </div>
</div>

<style>
  .wrapper {
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
  .client {
    transform-origin: 0 0;
    display: inline-flex;
  }
</style>

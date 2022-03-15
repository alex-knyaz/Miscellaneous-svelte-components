
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* ../src/RadioButtonGroup.svelte generated by Svelte v3.46.4 */

    const file$4 = "../src/RadioButtonGroup.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i].l;
    	child_ctx[5] = list[i].v;
    	return child_ctx;
    }

    // (7:2) {#each items as { l, v }}
    function create_each_block(ctx) {
    	let label;
    	let input;
    	let input_value_value;
    	let t0;
    	let t1_value = /*l*/ ctx[4] + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(input, "type", "radio");
    			input.__value = input_value_value = /*v*/ ctx[5];
    			input.value = input.__value;
    			attr_dev(input, "class", "svelte-c5o6kn");
    			/*$$binding_groups*/ ctx[3][0].push(input);
    			add_location(input, file$4, 8, 6, 149);
    			attr_dev(label, "class", "svelte-c5o6kn");
    			toggle_class(label, "checked-item", /*value*/ ctx[0] == /*v*/ ctx[5]);
    			add_location(label, file$4, 7, 4, 103);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			input.checked = input.__value === /*value*/ ctx[0];
    			append_dev(label, t0);
    			append_dev(label, t1);
    			append_dev(label, t2);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[2]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*items*/ 2 && input_value_value !== (input_value_value = /*v*/ ctx[5])) {
    				prop_dev(input, "__value", input_value_value);
    				input.value = input.__value;
    			}

    			if (dirty & /*value*/ 1) {
    				input.checked = input.__value === /*value*/ ctx[0];
    			}

    			if (dirty & /*items*/ 2 && t1_value !== (t1_value = /*l*/ ctx[4] + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*value, items*/ 3) {
    				toggle_class(label, "checked-item", /*value*/ ctx[0] == /*v*/ ctx[5]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			/*$$binding_groups*/ ctx[3][0].splice(/*$$binding_groups*/ ctx[3][0].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(7:2) {#each items as { l, v }}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let each_value = /*items*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "svelte-c5o6kn");
    			add_location(div, file$4, 5, 0, 65);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*value, items*/ 3) {
    				each_value = /*items*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RadioButtonGroup', slots, []);
    	let { items = [] } = $$props;
    	let { value } = $$props;
    	const writable_props = ['items', 'value'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<RadioButtonGroup> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input_change_handler() {
    		value = this.__value;
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$props => {
    		if ('items' in $$props) $$invalidate(1, items = $$props.items);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({ items, value });

    	$$self.$inject_state = $$props => {
    		if ('items' in $$props) $$invalidate(1, items = $$props.items);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, items, input_change_handler, $$binding_groups];
    }

    class RadioButtonGroup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { items: 1, value: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RadioButtonGroup",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*value*/ ctx[0] === undefined && !('value' in props)) {
    			console.warn("<RadioButtonGroup> was created without expected prop 'value'");
    		}
    	}

    	get items() {
    		throw new Error("<RadioButtonGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<RadioButtonGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<RadioButtonGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<RadioButtonGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* ../src/PanAndZoom.svelte generated by Svelte v3.46.4 */

    const file$3 = "../src/PanAndZoom.svelte";

    function create_fragment$3(ctx) {
    	let div1;
    	let div0;
    	let div0_style_value;
    	let div0_resize_listener;
    	let div1_resize_listener;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "client svelte-1bljxv3");
    			attr_dev(div0, "style", div0_style_value = "" + ((/*willChange*/ ctx[7] ? 'will-change: transform;' : '') + " -webkit-transform: translate(" + /*posX*/ ctx[1] + "px, " + /*posY*/ ctx[2] + "px) scale(" + /*scale*/ ctx[0] + ");"));
    			add_render_callback(() => /*div0_elementresize_handler*/ ctx[15].call(div0));
    			add_location(div0, file$3, 113, 2, 2595);
    			attr_dev(div1, "class", "wrapper svelte-1bljxv3");
    			add_render_callback(() => /*div1_elementresize_handler*/ ctx[17].call(div1));
    			add_location(div1, file$3, 103, 0, 2353);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			div0_resize_listener = add_resize_listener(div0, /*div0_elementresize_handler*/ ctx[15].bind(div0));
    			/*div1_binding*/ ctx[16](div1);
    			div1_resize_listener = add_resize_listener(div1, /*div1_elementresize_handler*/ ctx[17].bind(div1));
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "wheel", prevent_default(/*wheel*/ ctx[9]), false, true, false),
    					listen_dev(div1, "pointermove", prevent_default(/*pointerMove*/ ctx[11]), false, true, false),
    					listen_dev(div1, "pointerdown", /*pointerDown*/ ctx[10], false, false, false),
    					listen_dev(div1, "pointerup", /*pointerUp*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[13], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*willChange, posX, posY, scale*/ 135 && div0_style_value !== (div0_style_value = "" + ((/*willChange*/ ctx[7] ? 'will-change: transform;' : '') + " -webkit-transform: translate(" + /*posX*/ ctx[1] + "px, " + /*posY*/ ctx[2] + "px) scale(" + /*scale*/ ctx[0] + ");"))) {
    				attr_dev(div0, "style", div0_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			div0_resize_listener();
    			/*div1_binding*/ ctx[16](null);
    			div1_resize_listener();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const minScale = 0.5;
    const scaleStep = 0.01;

    function instance$3($$self, $$props, $$invalidate) {
    	let clientW;
    	let clientH;
    	let wrapW;
    	let wrapH;
    	let minPosX;
    	let minPosY;
    	let maxPosX;
    	let maxPosY;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PanAndZoom', slots, ['default']);
    	let { scale = 1 } = $$props;
    	let { posX = 100 } = $$props;
    	let { posY = 100 } = $$props;
    	let bound = (v, min_val, max_val) => Math.min(Math.max(v, min_val), max_val);
    	let willChange = false;
    	let timer;

    	const wheel = e => {
    		$$invalidate(7, willChange = true);
    		clearTimeout(timer);

    		timer = setTimeout(
    			() => {
    				$$invalidate(7, willChange = false);
    			},
    			250
    		);

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
    				$$invalidate(1, posX += mouseX / scale * delta);
    				$$invalidate(2, posY += mouseY / scale * delta);
    				$$invalidate(0, scale = newscale);
    			}
    		} else {
    			$$invalidate(1, posX -= e.deltaX * 2);
    			$$invalidate(2, posY -= e.deltaY * 2);
    		}

    		$$invalidate(1, posX = bound(posX, minPosX, maxPosX));
    		$$invalidate(2, posY = bound(posY, minPosY, maxPosY));
    	};

    	let startX = 0;
    	let startY = 0;
    	let wrapper;

    	const pointerDown = e => {
    		if (e.buttons == 1) {
    			let rect = e.currentTarget.getBoundingClientRect();
    			startX = e.clientX - rect.left - posX;
    			startY = e.clientY - rect.top - posY;
    		}

    		wrapper.setPointerCapture(e.pointerId);
    	};

    	const pointerMove = e => {
    		if (!wrapper.hasPointerCapture(e.pointerId)) return;
    		$$invalidate(7, willChange = true);
    		clearTimeout(timer);

    		timer = setTimeout(
    			() => {
    				$$invalidate(7, willChange = false);
    			},
    			250
    		);

    		let rect = e.currentTarget.getBoundingClientRect();
    		let mouseX = e.clientX - rect.left - posX;
    		let mouseY = e.clientY - rect.top - posY;

    		if (e.buttons == 1) {
    			$$invalidate(1, posX += mouseX - startX);
    			$$invalidate(2, posY += mouseY - startY);
    		}

    		$$invalidate(1, posX = bound(posX, minPosX, maxPosX));
    		$$invalidate(2, posY = bound(posY, minPosY, maxPosY));
    	};

    	const pointerUp = e => {
    		wrapper.releasePointerCapture(e.pointerId);
    		$$invalidate(7, willChange = false);
    	};

    	const writable_props = ['scale', 'posX', 'posY'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PanAndZoom> was created with unknown prop '${key}'`);
    	});

    	function div0_elementresize_handler() {
    		clientH = this.clientHeight;
    		clientW = this.clientWidth;
    		$$invalidate(5, clientH);
    		$$invalidate(6, clientW);
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			wrapper = $$value;
    			$$invalidate(8, wrapper);
    		});
    	}

    	function div1_elementresize_handler() {
    		wrapH = this.clientHeight;
    		wrapW = this.clientWidth;
    		$$invalidate(3, wrapH);
    		$$invalidate(4, wrapW);
    	}

    	$$self.$$set = $$props => {
    		if ('scale' in $$props) $$invalidate(0, scale = $$props.scale);
    		if ('posX' in $$props) $$invalidate(1, posX = $$props.posX);
    		if ('posY' in $$props) $$invalidate(2, posY = $$props.posY);
    		if ('$$scope' in $$props) $$invalidate(13, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		scale,
    		posX,
    		posY,
    		bound,
    		minScale,
    		scaleStep,
    		willChange,
    		timer,
    		wheel,
    		startX,
    		startY,
    		wrapper,
    		pointerDown,
    		pointerMove,
    		pointerUp,
    		maxPosY,
    		minPosY,
    		maxPosX,
    		minPosX,
    		wrapH,
    		wrapW,
    		clientH,
    		clientW
    	});

    	$$self.$inject_state = $$props => {
    		if ('scale' in $$props) $$invalidate(0, scale = $$props.scale);
    		if ('posX' in $$props) $$invalidate(1, posX = $$props.posX);
    		if ('posY' in $$props) $$invalidate(2, posY = $$props.posY);
    		if ('bound' in $$props) bound = $$props.bound;
    		if ('willChange' in $$props) $$invalidate(7, willChange = $$props.willChange);
    		if ('timer' in $$props) timer = $$props.timer;
    		if ('startX' in $$props) startX = $$props.startX;
    		if ('startY' in $$props) startY = $$props.startY;
    		if ('wrapper' in $$props) $$invalidate(8, wrapper = $$props.wrapper);
    		if ('maxPosY' in $$props) maxPosY = $$props.maxPosY;
    		if ('minPosY' in $$props) minPosY = $$props.minPosY;
    		if ('maxPosX' in $$props) maxPosX = $$props.maxPosX;
    		if ('minPosX' in $$props) minPosX = $$props.minPosX;
    		if ('wrapH' in $$props) $$invalidate(3, wrapH = $$props.wrapH);
    		if ('wrapW' in $$props) $$invalidate(4, wrapW = $$props.wrapW);
    		if ('clientH' in $$props) $$invalidate(5, clientH = $$props.clientH);
    		if ('clientW' in $$props) $$invalidate(6, clientW = $$props.clientW);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*clientW, scale*/ 65) {
    			minPosX = -clientW * scale + 10 * scale;
    		}

    		if ($$self.$$.dirty & /*clientH, scale*/ 33) {
    			minPosY = -clientH * scale + 10 * scale;
    		}

    		if ($$self.$$.dirty & /*wrapW, scale*/ 17) {
    			maxPosX = wrapW - 10 * scale;
    		}

    		if ($$self.$$.dirty & /*wrapH, scale*/ 9) {
    			maxPosY = wrapH - 10 * scale;
    		}
    	};

    	$$invalidate(6, clientW = 0);
    	$$invalidate(5, clientH = 0);
    	$$invalidate(4, wrapW = 0);
    	$$invalidate(3, wrapH = 0);

    	return [
    		scale,
    		posX,
    		posY,
    		wrapH,
    		wrapW,
    		clientH,
    		clientW,
    		willChange,
    		wrapper,
    		wheel,
    		pointerDown,
    		pointerMove,
    		pointerUp,
    		$$scope,
    		slots,
    		div0_elementresize_handler,
    		div1_binding,
    		div1_elementresize_handler
    	];
    }

    class PanAndZoom extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { scale: 0, posX: 1, posY: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PanAndZoom",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get scale() {
    		throw new Error("<PanAndZoom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scale(value) {
    		throw new Error("<PanAndZoom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get posX() {
    		throw new Error("<PanAndZoom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set posX(value) {
    		throw new Error("<PanAndZoom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get posY() {
    		throw new Error("<PanAndZoom>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set posY(value) {
    		throw new Error("<PanAndZoom>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* ../src/InteractiveLabel.svelte generated by Svelte v3.46.4 */

    const file$2 = "../src/InteractiveLabel.svelte";

    function create_fragment$2(ctx) {
    	let span;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*value*/ ctx[0]);
    			attr_dev(span, "class", "svelte-rdey8k");
    			add_location(span, file$2, 30, 0, 729);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);

    			if (!mounted) {
    				dispose = [
    					listen_dev(span, "pointerdown", /*handle_down*/ ctx[1], false, false, false),
    					listen_dev(span, "pointerup", /*handle_up*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*value*/ 1) set_data_dev(t, /*value*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InteractiveLabel', slots, []);
    	let { min = 0 } = $$props;
    	let { max = 500 } = $$props;
    	let { step = 1 } = $$props;
    	let { scale = 0.05 } = $$props;
    	let { value } = $$props;
    	let true_value = value;
    	let old_x;

    	let handle_move = e => {
    		let movement_x = e.screenX - old_x;
    		old_x = e.screenX;
    		true_value += movement_x * scale * step;
    		$$invalidate(0, value = Math.max(Math.min(Math.round(true_value), max), min));
    	};

    	let handle_down = e => {
    		old_x = e.screenX;
    		e.target.setPointerCapture(e.pointerId);
    		e.target.addEventListener("pointermove", handle_move);
    	};

    	let handle_up = e => {
    		old_x = 0;
    		e.target.releasePointerCapture(e.pointerId);
    		e.target.removeEventListener("pointermove", handle_move);
    		true_value = value;
    	};

    	const writable_props = ['min', 'max', 'step', 'scale', 'value'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InteractiveLabel> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('min' in $$props) $$invalidate(3, min = $$props.min);
    		if ('max' in $$props) $$invalidate(4, max = $$props.max);
    		if ('step' in $$props) $$invalidate(5, step = $$props.step);
    		if ('scale' in $$props) $$invalidate(6, scale = $$props.scale);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({
    		min,
    		max,
    		step,
    		scale,
    		value,
    		true_value,
    		old_x,
    		handle_move,
    		handle_down,
    		handle_up
    	});

    	$$self.$inject_state = $$props => {
    		if ('min' in $$props) $$invalidate(3, min = $$props.min);
    		if ('max' in $$props) $$invalidate(4, max = $$props.max);
    		if ('step' in $$props) $$invalidate(5, step = $$props.step);
    		if ('scale' in $$props) $$invalidate(6, scale = $$props.scale);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('true_value' in $$props) true_value = $$props.true_value;
    		if ('old_x' in $$props) old_x = $$props.old_x;
    		if ('handle_move' in $$props) handle_move = $$props.handle_move;
    		if ('handle_down' in $$props) $$invalidate(1, handle_down = $$props.handle_down);
    		if ('handle_up' in $$props) $$invalidate(2, handle_up = $$props.handle_up);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, handle_down, handle_up, min, max, step, scale];
    }

    class InteractiveLabel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			min: 3,
    			max: 4,
    			step: 5,
    			scale: 6,
    			value: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InteractiveLabel",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*value*/ ctx[0] === undefined && !('value' in props)) {
    			console.warn("<InteractiveLabel> was created without expected prop 'value'");
    		}
    	}

    	get min() {
    		throw new Error("<InteractiveLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set min(value) {
    		throw new Error("<InteractiveLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<InteractiveLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<InteractiveLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get step() {
    		throw new Error("<InteractiveLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set step(value) {
    		throw new Error("<InteractiveLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scale() {
    		throw new Error("<InteractiveLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scale(value) {
    		throw new Error("<InteractiveLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<InteractiveLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<InteractiveLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* ../src/Tooltip.svelte generated by Svelte v3.46.4 */

    const file$1 = "../src/Tooltip.svelte";
    const get_tooltip_slot_changes = dirty => ({});
    const get_tooltip_slot_context = ctx => ({});

    // (31:1) {#if isHovered}
    function create_if_block(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!!/*tooltip*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			set_style(div, "left", /*x*/ ctx[2] + "px");
    			set_style(div, "top", /*y*/ ctx[3] + "px");
    			attr_dev(div, "class", "tooltip svelte-1va337d");
    			add_location(div, file$1, 30, 16, 672);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}

    			if (!current || dirty & /*x*/ 4) {
    				set_style(div, "left", /*x*/ ctx[2] + "px");
    			}

    			if (!current || dirty & /*y*/ 8) {
    				set_style(div, "top", /*y*/ ctx[3] + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(31:1) {#if isHovered}",
    		ctx
    	});

    	return block;
    }

    // (32:28) {:else}
    function create_else_block(ctx) {
    	let current;
    	const tooltip_slot_template = /*#slots*/ ctx[8].tooltip;
    	const tooltip_slot = create_slot(tooltip_slot_template, ctx, /*$$scope*/ ctx[7], get_tooltip_slot_context);

    	const block = {
    		c: function create() {
    			if (tooltip_slot) tooltip_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (tooltip_slot) {
    				tooltip_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (tooltip_slot) {
    				if (tooltip_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						tooltip_slot,
    						tooltip_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(tooltip_slot_template, /*$$scope*/ ctx[7], dirty, get_tooltip_slot_changes),
    						get_tooltip_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tooltip_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tooltip_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (tooltip_slot) tooltip_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(32:28) {:else}",
    		ctx
    	});

    	return block;
    }

    // (32:4) {#if !!tooltip}
    function create_if_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*tooltip*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tooltip*/ 1) set_data_dev(t, /*tooltip*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(32:4) {#if !!tooltip}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let span;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);
    	let if_block = /*isHovered*/ ctx[1] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(span, "class", "wrapper svelte-1va337d");
    			add_location(span, file$1, 25, 0, 534);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span, "mouseover", /*mouseOver*/ ctx[4], false, false, false),
    					listen_dev(span, "mouseleave", /*mouseLeave*/ ctx[6], false, false, false),
    					listen_dev(span, "mousemove", /*mouseMove*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*isHovered*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isHovered*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tooltip', slots, ['default','tooltip']);
    	let { tooltip = null } = $$props;
    	let isHovered = false;
    	let x;
    	let y;

    	let mouseOver = event => {
    		$$invalidate(1, isHovered = true);
    		$$invalidate(2, x = event.clientX + 5);
    		$$invalidate(3, y = event.clientY + 5);
    	};

    	let mouseMove = event => {
    		$$invalidate(2, x = event.clientX + 5);
    		$$invalidate(3, y = event.clientY + 5);
    	};

    	let mouseLeave = () => {
    		$$invalidate(1, isHovered = false);
    	};

    	const writable_props = ['tooltip'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tooltip> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('tooltip' in $$props) $$invalidate(0, tooltip = $$props.tooltip);
    		if ('$$scope' in $$props) $$invalidate(7, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		tooltip,
    		isHovered,
    		x,
    		y,
    		mouseOver,
    		mouseMove,
    		mouseLeave
    	});

    	$$self.$inject_state = $$props => {
    		if ('tooltip' in $$props) $$invalidate(0, tooltip = $$props.tooltip);
    		if ('isHovered' in $$props) $$invalidate(1, isHovered = $$props.isHovered);
    		if ('x' in $$props) $$invalidate(2, x = $$props.x);
    		if ('y' in $$props) $$invalidate(3, y = $$props.y);
    		if ('mouseOver' in $$props) $$invalidate(4, mouseOver = $$props.mouseOver);
    		if ('mouseMove' in $$props) $$invalidate(5, mouseMove = $$props.mouseMove);
    		if ('mouseLeave' in $$props) $$invalidate(6, mouseLeave = $$props.mouseLeave);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [tooltip, isHovered, x, y, mouseOver, mouseMove, mouseLeave, $$scope, slots];
    }

    class Tooltip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { tooltip: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tooltip",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get tooltip() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tooltip(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.46.4 */
    const file = "src/App.svelte";

    // (26:4) <PanAndZoom>
    function create_default_slot_1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "https://placekitten.com/g/200/300")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "demo");
    			add_location(img, file, 26, 6, 592);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(26:4) <PanAndZoom>",
    		ctx
    	});

    	return block;
    }

    // (40:4) <Tooltip tooltip="test">
    function create_default_slot(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "hover pointer here";
    			add_location(div, file, 40, 6, 881);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(40:4) <Tooltip tooltip=\\\"test\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let h20;
    	let t1;
    	let section0;
    	let radiobuttongroup;
    	let updating_value;
    	let t2;
    	let br0;
    	let t3;
    	let t4;
    	let t5;
    	let h21;
    	let t7;
    	let section1;
    	let panandzoom;
    	let t8;
    	let h22;
    	let t10;
    	let section2;
    	let interactivelabel;
    	let updating_value_1;
    	let t11;
    	let br1;
    	let t12;
    	let t13;
    	let t14;
    	let h23;
    	let t16;
    	let section3;
    	let tooltip;
    	let current;

    	function radiobuttongroup_value_binding(value) {
    		/*radiobuttongroup_value_binding*/ ctx[2](value);
    	}

    	let radiobuttongroup_props = { items: [1, 5, 10, 25, 50, 100].map(func) };

    	if (/*value*/ ctx[0] !== void 0) {
    		radiobuttongroup_props.value = /*value*/ ctx[0];
    	}

    	radiobuttongroup = new RadioButtonGroup({
    			props: radiobuttongroup_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(radiobuttongroup, 'value', radiobuttongroup_value_binding));

    	panandzoom = new PanAndZoom({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function interactivelabel_value_binding(value) {
    		/*interactivelabel_value_binding*/ ctx[3](value);
    	}

    	let interactivelabel_props = {};

    	if (/*value_2*/ ctx[1] !== void 0) {
    		interactivelabel_props.value = /*value_2*/ ctx[1];
    	}

    	interactivelabel = new InteractiveLabel({
    			props: interactivelabel_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(interactivelabel, 'value', interactivelabel_value_binding));

    	tooltip = new Tooltip({
    			props: {
    				tooltip: "test",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			h20 = element("h2");
    			h20.textContent = "RadioButtonGroup";
    			t1 = space();
    			section0 = element("section");
    			create_component(radiobuttongroup.$$.fragment);
    			t2 = space();
    			br0 = element("br");
    			t3 = text("\n    value: ");
    			t4 = text(/*value*/ ctx[0]);
    			t5 = space();
    			h21 = element("h2");
    			h21.textContent = "PanAndZoom";
    			t7 = space();
    			section1 = element("section");
    			create_component(panandzoom.$$.fragment);
    			t8 = space();
    			h22 = element("h2");
    			h22.textContent = "InteractiveLabel";
    			t10 = space();
    			section2 = element("section");
    			create_component(interactivelabel.$$.fragment);
    			t11 = space();
    			br1 = element("br");
    			t12 = text("\n    value: ");
    			t13 = text(/*value_2*/ ctx[1]);
    			t14 = space();
    			h23 = element("h2");
    			h23.textContent = "Tooltip";
    			t16 = space();
    			section3 = element("section");
    			create_component(tooltip.$$.fragment);
    			add_location(h20, file, 13, 2, 312);
    			add_location(br0, file, 19, 4, 473);
    			attr_dev(section0, "class", "svelte-1tykgr2");
    			add_location(section0, file, 14, 2, 340);
    			add_location(h21, file, 23, 2, 515);
    			set_style(section1, "padding", "0px");
    			attr_dev(section1, "class", "svelte-1tykgr2");
    			add_location(section1, file, 24, 2, 537);
    			add_location(h22, file, 30, 2, 685);
    			add_location(br1, file, 33, 4, 773);
    			attr_dev(section2, "class", "svelte-1tykgr2");
    			add_location(section2, file, 31, 2, 713);
    			add_location(h23, file, 37, 2, 817);
    			attr_dev(section3, "class", "svelte-1tykgr2");
    			add_location(section3, file, 38, 2, 836);
    			add_location(main, file, 12, 0, 303);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h20);
    			append_dev(main, t1);
    			append_dev(main, section0);
    			mount_component(radiobuttongroup, section0, null);
    			append_dev(section0, t2);
    			append_dev(section0, br0);
    			append_dev(section0, t3);
    			append_dev(section0, t4);
    			append_dev(main, t5);
    			append_dev(main, h21);
    			append_dev(main, t7);
    			append_dev(main, section1);
    			mount_component(panandzoom, section1, null);
    			append_dev(main, t8);
    			append_dev(main, h22);
    			append_dev(main, t10);
    			append_dev(main, section2);
    			mount_component(interactivelabel, section2, null);
    			append_dev(section2, t11);
    			append_dev(section2, br1);
    			append_dev(section2, t12);
    			append_dev(section2, t13);
    			append_dev(main, t14);
    			append_dev(main, h23);
    			append_dev(main, t16);
    			append_dev(main, section3);
    			mount_component(tooltip, section3, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const radiobuttongroup_changes = {};

    			if (!updating_value && dirty & /*value*/ 1) {
    				updating_value = true;
    				radiobuttongroup_changes.value = /*value*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			radiobuttongroup.$set(radiobuttongroup_changes);
    			if (!current || dirty & /*value*/ 1) set_data_dev(t4, /*value*/ ctx[0]);
    			const panandzoom_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				panandzoom_changes.$$scope = { dirty, ctx };
    			}

    			panandzoom.$set(panandzoom_changes);
    			const interactivelabel_changes = {};

    			if (!updating_value_1 && dirty & /*value_2*/ 2) {
    				updating_value_1 = true;
    				interactivelabel_changes.value = /*value_2*/ ctx[1];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			interactivelabel.$set(interactivelabel_changes);
    			if (!current || dirty & /*value_2*/ 2) set_data_dev(t13, /*value_2*/ ctx[1]);
    			const tooltip_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				tooltip_changes.$$scope = { dirty, ctx };
    			}

    			tooltip.$set(tooltip_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(radiobuttongroup.$$.fragment, local);
    			transition_in(panandzoom.$$.fragment, local);
    			transition_in(interactivelabel.$$.fragment, local);
    			transition_in(tooltip.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(radiobuttongroup.$$.fragment, local);
    			transition_out(panandzoom.$$.fragment, local);
    			transition_out(interactivelabel.$$.fragment, local);
    			transition_out(tooltip.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(radiobuttongroup);
    			destroy_component(panandzoom);
    			destroy_component(interactivelabel);
    			destroy_component(tooltip);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = i => ({ l: `${i}x`, v: i });

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let value = 10;
    	let value_2 = 10;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function radiobuttongroup_value_binding(value$1) {
    		value = value$1;
    		$$invalidate(0, value);
    	}

    	function interactivelabel_value_binding(value) {
    		value_2 = value;
    		$$invalidate(1, value_2);
    	}

    	$$self.$capture_state = () => ({
    		RadioButtonGroup,
    		value,
    		PanAndZoom,
    		InteractiveLabel,
    		value_2,
    		Tooltip
    	});

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('value_2' in $$props) $$invalidate(1, value_2 = $$props.value_2);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, value_2, radiobuttongroup_value_binding, interactivelabel_value_binding];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map

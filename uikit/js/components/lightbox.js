/*! K 3.0.0-beta.25 | http://www.getuikit.com | (c) 2014 - 2017 YOOtheme | MIT License */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('uikitlightbox', factory) :
    (global.KLightbox = factory());
}(this, (function () { 'use strict';

function plugin(K) {

    if (plugin.installed) {
        return;
    }

    var mixin = K.mixin;
    var util = K.util;
    var $ = util.$;
    var $trigger = util.$trigger;
    var Animation = util.Animation;
    var ajax = util.ajax;
    var assign = util.assign;
    var doc = util.doc;
    var docElement = util.docElement;
    var fastdom = util.fastdom;
    var getData = util.getData;
    var getImage = util.getImage;
    var getIndex = util.getIndex;
    var noop = util.noop;
    var on = util.on;
    var off = util.off;
    var pointerDown = util.pointerDown;
    var pointerMove = util.pointerMove;
    var pointerUp = util.pointerUp;
    var preventClick = util.preventClick;
    var promise = util.promise;
    var requestAnimationFrame = util.requestAnimationFrame;
    var Transition = util.Transition;

    K.component('lightbox', {

        attrs: true,

        props: {
            animation: String,
            toggle: String
        },

        defaults: {
            animation: undefined,
            toggle: 'a'
        },

        computed: {

            toggles: function toggles() {
                var this$1 = this;

                var toggles = $(this.toggle, this.$el);

                this._changed = !this._toggles
                    || toggles.length !== this._toggles.length
                    || toggles.toArray().some(function (el, i) { return el !== this$1._toggles.get(i); });

                return this._toggles = toggles;
            }

        },

        disconnected: function disconnected() {

            if (this.panel) {
                this.panel.$destroy(true);
                this.panel = null;
            }

        },

        events: [

            {

                name: 'click',

                delegate: function delegate() {
                    return ((this.toggle) + ":not(.disabled)");
                },

                handler: function handler(e) {
                    e.preventDefault();
                    this.show(this.toggles.index(e.currentTarget));
                }

            }

        ],

        update: function update() {

            if (this.panel && this.animation) {
                this.panel.$props.animation = this.animation;
                this.panel.$emit();
            }

            if (!this.toggles.length || !this._changed || !this.panel) {
                return;
            }

            this.panel.$destroy(true);
            this._init();

        },

        methods: {

            _init: function _init() {
                return this.panel = this.panel || K.lightboxPanel({
                        animation: this.animation,
                        items: this.toggles.toArray().reduce(function (items, el) {
                            items.push(['href', 'caption', 'type'].reduce(function (obj, attr) {
                                obj[attr === 'href' ? 'source' : attr] = getData(el, attr);
                                return obj;
                            }, {}));
                            return items;
                        }, [])
                    });
            },

            show: function show(index) {

                if (!this.panel) {
                    this._init();
                }

                return this.panel.show(index);

            },

            hide: function hide() {

                return this.panel && this.panel.hide();

            }

        }

    });

    K.component('lightbox-panel', {

        mixins: [mixin.togglable],

        functional: true,

        defaults: {
            animation: 'slide',
            transition: 'ease',
            duration: 400,
            attrItem: 'lightbox-item',
            preload: 1,
            items: [],
            index: 0,
            clsPage: 'lightbox-page',
            clsItem: 'lightbox-item',
            stack: [],
            threshold: 15,
            percent: 0,
            cls: 'open',
            clsActive: 'active',
            delayControls: 3000,
            template: "\n                <div class=\"lightbox overflow-hidden\">\n                    <ul class=\"lightbox-items\"></ul>\n                    <div class=\"lightbox-toolbar position-top text-right\">\n                        <button class=\"lightbox-toolbar-icon close-large\" type=\"button\" close toggle=\"!.lightbox\"></button>\n                     </div>\n                    <a class=\"lightbox-button position-center-left position-medium\" href=\"#\" slidenav-previous lightbox-item=\"previous\"></a>\n                    <a class=\"lightbox-button position-center-right position-medium\" href=\"#\" slidenav-next lightbox-item=\"next\"></a>\n                    <div class=\"lightbox-toolbar lightbox-caption position-bottom text-center\"></div>\n                </div>"
        },

        computed: {

            container: function container() {
                return $(this.$props.container === true && K.container || this.$props.container || K.container);
            },

            slides: function slides() {
                return this.list.children(("." + (this.clsItem)));
            },

            forwardDuration: function forwardDuration() {
                return this.duration / 4;
            }

        },

        created: function created() {
            var this$1 = this;


            this.$mount($(this.template).appendTo(this.container)[0]);

            this.list = this.$el.find('.lightbox-items');
            this.toolbars = this.$el.find('.lightbox-toolbar');
            this.nav = this.$el.find('a[lightbox-item]');
            this.caption = this.$el.find('.lightbox-caption');

            this.items.forEach(function (el, i) { return this$1.list.append(("<li class=\"" + (this$1.clsItem) + " item-" + i + "\"></li>")); });

        },

        init: function init() {
            var this$1 = this;

            ['start', 'move', 'end'].forEach(function (key) {
                var fn = this$1[key];
                this$1[key] = function (e) {

                    e = e.originalEvent || e;

                    this$1.prevPos = this$1.pos;
                    this$1.pos = (e.touches && e.touches[0] || e).pageX;

                    fn(e);
                }
            });
        },

        events: [

            {

                name: (pointerMove + " " + pointerDown + " keydown"),

                handler: 'showControls'

            },

            {

                name: 'click',

                self: true,

                handler: function handler(e) {
                    e.preventDefault();
                    this.hide();
                }

            },

            {

                name: 'click',

                self: true,

                delegate: function delegate() {
                    return ("." + (this.clsItem));
                },

                handler: function handler(e) {
                    e.preventDefault();
                    this.hide();
                }

            },

            {

                name: 'click',

                delegate: function delegate() {
                    return ("[" + (this.attrItem) + "]");
                },

                handler: function handler(e) {
                    e.preventDefault();
                    this.show($(e.currentTarget).attr(this.attrItem));
                }

            },

            {

                name: 'show',

                self: true,

                handler: function handler() {

                    this.$addClass(docElement, this.clsPage);

                }
            },

            {

                name: 'shown',

                self: true,

                handler: function handler() {

                    this.$addClass(this.caption, 'animation-slide-bottom');
                    this.toolbars.attr('hidden', true);
                    this.nav.attr('hidden', true);
                    this.showControls();

                }
            },

            {

                name: 'hide',

                self: true,

                handler: function handler() {

                    this.$removeClass(this.caption, 'animation-slide-bottom');
                    this.toolbars.attr('hidden', true);
                    this.nav.attr('hidden', true);

                }
            },

            {

                name: 'hidden',

                self: true,

                handler: function handler() {

                    this.$removeClass(docElement, this.clsPage);

                }
            },

            {

                name: 'keydown',

                el: function el() {
                    return doc;
                },

                handler: function handler(e) {

                    if (!this.isToggled(this.$el)) {
                        return;
                    }

                    switch (e.keyCode) {
                        case 27:
                            this.hide();
                            break;
                        case 37:
                            this.show('previous');
                            break;
                        case 39:
                            this.show('next');
                            break;
                    }
                }
            },

            {

                name: 'toggle',

                handler: function handler(e) {
                    e.preventDefault();
                    this.toggle();
                }

            },

            {

                name: pointerDown,

                delegate: function delegate() {
                    return ("." + (this.clsItem));
                },

                handler: 'start'
            }

        ],

        methods: {

            start: function start(e) {
                var this$1 = this;


                if (e.button && e.button !== 0) {
                    return;
                }

                e.preventDefault();

                if (this.stack.length) {
                    this.stack.splice(1);
                    this._animation && this._animation.stop().then(function () { return this$1.start(e); });
                    return;
                }

                on(doc, pointerMove, this.move, true);
                on(doc, pointerUp, this.end, true);

                this.touch = {
                    start: this.pos,
                    current: this.slides.eq(this.index),
                    prev: this.slides.eq(this.getIndex('previous')),
                    next: this.slides.eq(this.getIndex('next'))
                };

            },

            move: function move() {

                var ref = this.touch;
                var start = ref.start;
                var current = ref.current;
                var next = ref.next;
                var prev = ref.prev;

                if (this.pos === this.prevPos || (!this.touching && Math.abs(start - this.pos) < this.threshold)) {
                    return;
                }

                this.touching = true;

                var percent = (this.pos - start) / current.outerWidth();

                if (this.percent === percent) {
                    return;
                }

                this.percent = percent;

                this.$toggleClass(next, this.clsActive, percent < 0);
                this.$toggleClass(prev, this.clsActive, percent >= 0);

                new Translator(
                    this.animation,
                    this.transition,
                    current,
                    percent >= 0 ? prev : next,
                    percent < 0 ? 1 : -1,
                    noop
                ).translate(Math.abs(percent));

            },

            end: function end(e) {

                e.preventDefault();

                off(doc, pointerMove, this.move, true);
                off(doc, pointerUp, this.end, true);

                if (this.touching) {

                    var percent = this.percent;

                    this.percent = Math.abs(this.percent);

                    if (this.percent < 0.2) {
                        this.index = this.getIndex(percent > 0 ? 'previous' : 'next');
                        this.percent = 1 - this.percent;
                        percent *= -1;

                    }

                    this.show(percent > 0 ? 'previous': 'next', true);

                    preventClick();

                }

                this.pos
                    = this.prevPos
                    = this.touch
                    = this.touching
                    = this.percent
                    = null;

            },

            toggle: function toggle() {
                return this.isToggled() ? this.hide() : this.show();
            },

            show: function show(index, force) {
                var this$1 = this;
                if ( force === void 0 ) force = false;


                var hasPrev = this.items.length > 1;
                if (!this.isToggled()) {
                    this.toggleNow(this.$el, true);
                    hasPrev = false;
                }

                if (!force && this.touch) {
                    return;
                }

                this.stack[force ? 'unshift' : 'push'](index);

                if (!force && this.stack.length > 1) {

                    if (this.stack.length === 2) {
                        this._animation.forward(this.forwardDuration);
                    }

                    return;
                }

                var dir = index === 'next' ? 1 : -1;

                index = this.getIndex(index);

                var prev = hasPrev && this.slides.eq(this.index),
                    next = this.slides.eq(index);

                this.index = index;

                this.$addClass(next, this.clsActive);

                var caption = this.getItem(index).caption;
                this.caption.toggle(!!caption).text(caption);

                this._animation = new Translator(!prev ? 'scale' : this.animation, this.transition, prev || next, next, dir, function () {

                    prev && this$1.$removeClass(prev, this$1.clsActive);

                    this$1.stack.shift();
                    if (this$1.stack.length) {
                        requestAnimationFrame(function () { return this$1.show(this$1.stack.shift(), true); });
                    } else {
                        this$1._animation = null;
                    }

                    this$1.$el.trigger('itemshown', [this$1, next]);

                    if (prev) {
                        this$1.$el.trigger('itemhidden', [this$1, prev]);
                        K.update(null, prev);
                    }

                });

                this._animation.show(this.stack.length > 1 ? this.forwardDuration : this.duration, this.percent);

                for (var i = 0; i <= this.preload; i++) {
                    this$1.loadItem(this$1.getIndex(index + i));
                    this$1.loadItem(this$1.getIndex(index - i));
                }

                this.$el.trigger('itemshow', [this, next]);
                prev && this.$el.trigger('itemhide', [this, prev]);
                K.update(null, next);
                fastdom.flush(); // iOS 10+ will honor the video.play only if called from a gesture handler
            },

            hide: function hide() {

                if (this.isToggled()) {
                    this.toggleNow(this.$el, false);
                }

                this.slides
                    .removeClass(this.clsActive)
                    .each(function (_, el) { return Transition.stop(el); });

                delete this.index;
                delete this.percent;
                delete this._animation;

            },

            loadItem: function loadItem(index) {
                if ( index === void 0 ) index = this.index;


                var item = this.getItem(index);

                if (item.content) {
                    return;
                }

                this.setItem(item, '<span spinner></span>');

                if (!$trigger(this.$el, 'itemload', [item], true).isImmediatePropagationStopped()) {
                    this.setError(item);
                }
            },

            getItem: function getItem(index) {
                if ( index === void 0 ) index = this.index;

                return this.items[index] || {source: '', caption: '', type: ''};
            },

            setItem: function setItem(item, content) {
                assign(item, {content: content});
                var el = this.slides.eq(this.items.indexOf(item)).html(content);
                this.$el.trigger('itemloaded', [this, el]);
                K.update(null, el);
            },

            setError: function setError(item) {
                this.setItem(item, '<span icon="icon: bolt; ratio: 2"></span>');
            },

            getIndex: function getIndex$1(index) {
                if ( index === void 0 ) index = this.index;

                return getIndex(index, this.items, this.index);
            },

            showControls: function showControls() {

                clearTimeout(this.controlsTimer);
                this.controlsTimer = setTimeout(this.hideControls, this.delayControls);

                if (!this.toolbars.attr('hidden')) {
                    return;
                }

                animate(this.toolbars.eq(0), 'animation-slide-top');
                animate(this.toolbars.eq(1), 'animation-slide-bottom');

                this.nav.attr('hidden', this.items.length <= 1);

                if (this.items.length > 1) {
                    animate(this.nav.eq(0), 'animation-fade');
                    animate(this.nav.eq(1), 'animation-fade');
                }

            },

            hideControls: function hideControls() {

                if (this.toolbars.attr('hidden')) {
                    return;
                }

                animate(this.toolbars.eq(0), 'animation-slide-top', 'out');
                animate(this.toolbars.eq(1), 'animation-slide-bottom', 'out');

                if (this.items.length > 1) {
                    animate(this.nav.eq(0), 'animation-fade', 'out');
                    animate(this.nav.eq(1), 'animation-fade', 'out');
                }

            }

        }

    });

    function animate(el, animation, dir) {
        if ( dir === void 0 ) dir = 'in';

        Animation[dir](el.attr('hidden', false), animation).then(function () { dir === 'out' && el.attr('hidden', true)})
    }

    function Translator (animation, transition, current, next, dir, cb) {

        animation = animation in Animations ? Animations[animation] : Animations.slide;

        return {

            show: function show(duration, percent) {
                if ( percent === void 0 ) percent = 0;


                duration -= Math.round(duration * percent);

                var props = animation.show(dir);

                this.translate(percent);

                return promise.all([
                    Transition.start(current, props[0], duration, transition),
                    Transition.start(next, props[1], duration, transition)
                ]).then(function () {
                    for (var prop in props[0]) {
                        $([next[0], current[0]]).css(prop, '');
                    }
                    cb();
                }, noop);
            },

            stop: function stop() {
                return promise.all([
                    Transition.stop(next),
                    Transition.stop(current)
                ])
            },

            forward: function forward(duration) {
                var this$1 = this;


                var percent = animation.percent(current);

                return promise.all([
                    Transition.cancel(next),
                    Transition.cancel(current)
                ]).then(function () { return this$1.show(duration, percent); });

            },

            translate: function translate(percent) {

                var props = animation.translate(percent, dir);
                current.css(props[0]);
                next.css(props[1]);

            }

        }

    }

    var diff = 0.2;
    var Animations = {

        fade: {

            show: function show() {
                return [
                    {opacity: 0},
                    {opacity: 1}
                ];
            },

            percent: function percent(current) {
                return 1 - current.css('opacity');
            },

            translate: function translate(percent) {
                return [
                    {opacity: 1 - percent},
                    {opacity: percent}
                ];
            }

        },

        slide: {

            show: function show(dir) {
                return [
                    {transform: ("translate3d(" + (-1 * dir * 100) + "%, 0, 0)")},
                    {transform: 'translate3d(0, 0, 0)'}
                ];
            },

            percent: function percent(current) {
                return Math.abs(current.css('transform').split(',')[4] / current.outerWidth());
            },

            translate: function translate(percent, dir) {
                return [
                    {transform: ("translate3d(" + (dir * -100 * percent) + "%, 0, 0)")},
                    {transform: ("translate3d(" + (dir * 100 * (1 - percent)) + "%, 0, 0)")}
                ];
            }

        },

        scale: {

            show: function show() {
                return [
                    {opacity: 0, transform: ("scale3d(" + (1 - diff) + ", " + (1 - diff) + ", 1)")},
                    {opacity: 1, transform: 'scale3d(1, 1, 1)'}
                ];
            },

            percent: function percent(current) {
                return 1 - current.css('opacity');
            },

            translate: function translate(percent) {
                var scale1 = 1 - diff * percent,
                    scale2 = 1 - diff + diff * percent;

                return [
                    {opacity: 1 - percent, transform: ("scale3d(" + scale1 + ", " + scale1 + ", 1)")},
                    {opacity: percent, transform: ("scale3d(" + scale2 + ", " + scale2 + ", 1)")}
                ];
            }

        }

    };


    K.mixin({

        events: {

            itemload: function itemload(e, item) {
                var this$1 = this;


                if (!(item.type === 'image' || item.source && item.source.match(/\.(jp(e)?g|png|gif|svg)$/i))) {
                    return;
                }

                getImage(item.source).then(
                    function (img) { return this$1.setItem(item, ("<img width=\"" + (img.width) + "\" height=\"" + (img.height) + "\" src =\"" + (item.source) + "\">")); },
                    function () { return this$1.setError(item); }
                );

                e.stopImmediatePropagation();
            }

        }

    }, 'lightboxPanel');

    K.mixin({

        events: {

            itemload: function itemload(e, item) {
                var this$1 = this;


                if (!(item.type === 'video' || item.source && item.source.match(/\.(mp4|webm|ogv)$/i))) {
                    return;
                }

                var video = $('<video controls playsinline video></video>')
                    .on('loadedmetadata', function () { return this$1.setItem(item, video.attr({width: video[0].videoWidth, height: video[0].videoHeight})); })
                    .on('error', function () { return this$1.setError(item); })
                    .attr('src', item.source);

                e.stopImmediatePropagation();
            }

        }

    }, 'lightboxPanel');

    K.mixin({

        events: {

            itemload: function itemload(e, item) {
                var this$1 = this;


                var matches = item.source.match(/\/\/.*?youtube\.[a-z]+\/watch\?v=([^&\s]+)/) || item.source.match(/youtu\.be\/(.*)/);

                if (!matches) {
                    return;
                }

                var id = matches[1],
                    setIframe = function (width, height) {
                        if ( width === void 0 ) width = 640;
                        if ( height === void 0 ) height = 320;

                        return this$1.setItem(item, getIframe(("//www.youtube.com/embed/" + id), width, height));
                };

                getImage(("//img.youtube.com/vi/" + id + "/maxresdefault.jpg")).then(
                    function (img) {
                        //youtube default 404 thumb, fall back to lowres
                        if (img.width === 120 && img.height === 90) {
                            getImage(("//img.youtube.com/vi/" + id + "/0.jpg")).then(
                                function () { return setIframe(img.width, img.height); },
                                setIframe
                            );
                        } else {
                            setIframe(img.width, img.height);
                        }
                    },
                    setIframe
                );

                e.stopImmediatePropagation();
            }

        }

    }, 'lightboxPanel');

    K.mixin({

        events: {

            itemload: function itemload(e, item) {
                var this$1 = this;


                var matches = item.source.match(/(\/\/.*?)vimeo\.[a-z]+\/([0-9]+).*?/);

                if (!matches) {
                    return;
                }

                ajax({type: 'GET', url: ("http://vimeo.com/api/oembed.json?url=" + (encodeURI(item.source))), jsonp: 'callback', dataType: 'jsonp'})
                    .then(function (ref) {
                        var height = ref.height;
                        var width = ref.width;

                        return this$1.setItem(item, getIframe(("//player.vimeo.com/video/" + (matches[2])), width, height));
                });

                e.stopImmediatePropagation();
            }

        }

    }, 'lightboxPanel');

    function getIframe(src, width, height) {
        return ("<iframe src=\"" + src + "\" width=\"" + width + "\" height=\"" + height + "\" style=\"max-width: 100%; box-sizing: border-box;\" video responsive></iframe>");
    }

}

if (!false && typeof window !== 'undefined' && window.K) {
    window.K.use(plugin);
}

return plugin;

})));
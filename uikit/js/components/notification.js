/*! K 3.0.0-beta.25 | http://www.getuikit.com | (c) 2014 - 2017 YOOtheme | MIT License */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('uikitnotification', factory) :
    (global.KNotification = factory());
}(this, (function () { 'use strict';

function plugin(K) {

    if (plugin.installed) {
        return;
    }

    var ref = K.util;
    var $ = ref.$;
    var each = ref.each;
    var pointerEnter = ref.pointerEnter;
    var pointerLeave = ref.pointerLeave;
    var Transition = ref.Transition;
    var containers = {};

    K.component('notification', {

        functional: true,

        args: ['message', 'status'],

        defaults: {
            message: '',
            status: '',
            timeout: 5000,
            group: null,
            pos: 'top-center',
            onClose: null,
            clsClose: 'notification-close',
            clsMsg: 'notification-message'
        },

        created: function created() {

            if (!containers[this.pos]) {
                containers[this.pos] = $(("<div class=\"notification notification-" + (this.pos) + "\"></div>")).appendTo(K.container);
            }

            this.$mount($(
                ("<div class=\"" + (this.clsMsg) + (this.status ? (" " + (this.clsMsg) + "-" + (this.status)) : '') + "\">\n                    <a href=\"#\" class=\"" + (this.clsClose) + "\" data-close></a>\n                    <div>" + (this.message) + "</div>\n                </div>")
            ).appendTo(containers[this.pos].show())[0]);

        },

        ready: function ready() {
            var this$1 = this;


            var marginBottom = parseInt(this.$el.css('margin-bottom'), 10);

            Transition.start(
                this.$el.css({opacity: 0, marginTop: -1 * this.$el.outerHeight(), marginBottom: 0}),
                {opacity: 1, marginTop: 0, marginBottom: marginBottom}
            ).then(function () {
                if (this$1.timeout) {
                    this$1.timer = setTimeout(this$1.close, this$1.timeout);
                }
            });

        },

        events: ( obj = {

            click: function click(e) {
                if ($(e.target).closest('a[href="#"]').length) {
                    e.preventDefault();
                }
                this.close();
            }

        }, obj[pointerEnter] = function () {
                if (this.timer) {
                    clearTimeout(this.timer);
                }
            }, obj[pointerLeave] = function () {
                if (this.timeout) {
                    this.timer = setTimeout(this.close, this.timeout);
                }
            }, obj ),

        methods: {

            close: function close(immediate) {
                var this$1 = this;


                var remove = function () {

                    this$1.onClose && this$1.onClose();
                    this$1.$el.trigger('close', [this$1]).remove();

                    if (!containers[this$1.pos].children().length) {
                        containers[this$1.pos].hide();
                    }

                };

                if (this.timer) {
                    clearTimeout(this.timer);
                }

                if (immediate) {
                    remove();
                } else {
                    Transition.start(this.$el, {opacity: 0, marginTop: -1 * this.$el.outerHeight(), marginBottom: 0}).then(remove)
                }
            }

        }

    });
    var obj;

    K.notification.closeAll = function (group, immediate) {
        each(K.instances, function (_, component) {
            if (component.$options.name === 'notification' && (!group || group === component.group)) {
                component.close(immediate);
            }
        })
    };

}

if (!false && typeof window !== 'undefined' && window.K) {
    window.K.use(plugin);
}

return plugin;

})));
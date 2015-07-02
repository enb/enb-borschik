/*
* This is minimal stub compiled bemtree template file
* It was generated with help of generator-bem-stub tool
* Contains only page block
*/

(function(g) {
    var __bem_xjst = function(exports) {
        var $$mode = "", $$block = "", $$elem = "", $$elemMods = null, $$mods = null;

        var __$ref = {};

        function apply(ctx) {
            ctx = ctx || this;
            $$mods = ctx["mods"];
            $$elemMods = ctx["elemMods"];
            $$elem = ctx["elem"];
            $$block = ctx["block"];
            $$mode = ctx["_mode"];
            try {
                return applyc(ctx, __$ref);
            } catch (e) {
                e.xjstContext = ctx;
                throw e;
            }
        }

        exports.apply = apply;

        function applyc(__$ctx, __$ref) {
            var __$t = $$mode;
            if (__$t === "content") {
                if ($$block === "page" && !$$elem) {
                    return [ {
                        elem: "css",
                        url: "/_site.css"
                    }, {
                        elem: "js",
                        url: borschik.link("./site.js")
                    } ];
                }
                return __$ctx.ctx.content;
            } else if (__$t === "default") {
                var __$r = __$b3(__$ctx, __$ref);
                if (__$r !== __$ref) return __$r;
            } else if (__$t === "") {
                if (__$ctx.isSimple(__$ctx.ctx)) {
                    var __$r = __$b4(__$ctx, __$ref);
                    if (__$r !== __$ref) return __$r;
                }
                if (__$ctx.isArray(__$ctx.ctx)) {
                    var __$r = __$b5(__$ctx, __$ref);
                    if (__$r !== __$ref) return __$r;
                }
                var __$r = __$b6(__$ctx, __$ref);
                if (__$r !== __$ref) return __$r;
            }
        }

        [ function(exports, context) {
            var undef, BEM_ = {}, toString = Object.prototype.toString, isArray = Array.isArray || function(obj) {
                    return toString.call(obj) === "[object Array]";
                }, buildEscape = function() {
                var ts = {
                    '"': "&quot;",
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;"
                }, f = function(t) {
                    return ts[t] || t;
                };
                return function(r) {
                    r = new RegExp(r, "g");
                    return function(s) {
                        return ("" + s).replace(r, f);
                    };
                };
            }();
            context.BEMContext = BEMContext;
            function BEMContext(context, apply_) {
                this.ctx = context;
                this.apply = apply_;
                this._buf = {};
                this.__queue = [];
                this._ = this;
                this._mode = "";
                this.block = undef;
                this.elem = undef;
                this.mods = undef;
                this.elemMods = undef;
            }
            BEMContext.prototype.isArray = isArray;
            BEMContext.prototype.isSimple = function isSimple(obj) {
                var t = typeof obj;
                return t === "string" || t === "number" || t === "boolean";
            };
            BEMContext.prototype.extend = function extend(o1, o2) {
                if (!o1 || !o2) return o1 || o2;
                var res = {}, n;
                for (n in o1) o1.hasOwnProperty(n) && (res[n] = o1[n]);
                for (n in o2) o2.hasOwnProperty(n) && (res[n] = o2[n]);
                return res;
            };
            var cnt = 0, id = +new Date(), expando = "__" + id, get = function() {
                return "uniq" + id + ++cnt;
            };
            BEMContext.prototype.identify = function(obj, onlyGet) {
                if (!obj) return get();
                if (onlyGet || obj[expando]) {
                    return obj[expando];
                } else return obj[expando] = get();
            };
            BEMContext.prototype.xmlEscape = buildEscape("[&<>]");
            BEMContext.prototype.attrEscape = buildEscape('["&<>]');
            BEMContext.prototype.generateId = function generateId() {
                return this.identify(this.ctx);
            };
            BEMContext.prototype.doAsync = function doAsync(fn) {
                var mode = this._mode, ctx = this.ctx, block = this.block, elem = this.elem, mods = this.mods, elemMods = this.elemMods, promise = Vow.invoke(fn);
                this.__queue.push(promise);
                promise.always(function() {
                    this._mode = mode;
                    this.ctx = ctx;
                    this.block = block;
                    this.elem = elem;
                    this.mods = mods;
                    this.elemMods = elemMods;
                }.bind(this));
                return promise;
            };
            var oldApply = exports.apply;
            exports.apply = BEMContext.applyAsync = function BEMContext_applyAsync(context) {
                var ctx = new BEMContext(context || this, oldApply);
                ctx._buf = ctx.apply();
                return Vow.allResolved(ctx.__queue).always(function() {
                    return ctx._buf;
                });
            };
            BEMContext.prototype.reapply = BEMContext.applyAsync;
        } ].forEach(function(fn) {
                fn(exports, this);
            }, {
                recordExtensions: function(ctx) {
                    ctx["_mode"] = undefined;
                    ctx["ctx"] = undefined;
                    ctx["block"] = undefined;
                    ctx["_currBlock"] = undefined;
                    ctx["elem"] = undefined;
                    ctx["mods"] = undefined;
                    ctx["elemMods"] = undefined;
                },
                resetApplyNext: function(ctx) {}
            });

        function __$b3(__$ctx, __$ref) {
            var __$r__$2;
            var __$l2__$3 = $$mode;
            $$mode = "content";
            __$r__$2 = applyc(__$ctx, __$ref);
            $$mode = __$l2__$3;
            var content__$0 = __$r__$2;
            if (content__$0 || content__$0 === 0) {
                var __$r__$4;
                var __$l0__$5 = $$mode;
                $$mode = "";
                var __$l1__$6 = __$ctx.ctx;
                __$ctx.ctx = content__$0;
                __$r__$4 = applyc(__$ctx, __$ref);
                $$mode = __$l0__$5;
                __$ctx.ctx = __$l1__$6;
                __$ctx.ctx.content = __$r__$4;
            }
            return __$ctx.ctx;
        }

        function __$b4(__$ctx, __$ref) {
            var ctx__$7 = __$ctx.ctx;
            if (ctx__$7 && ctx__$7 !== true || ctx__$7 === 0) {
                return ctx__$7;
            }
            return;
        }

        function __$b5(__$ctx, __$ref) {
            var ctx__$8 = __$ctx.ctx, len__$9 = ctx__$8.length, i__$10 = 0, buf__$11 = [];
            while (i__$10 < len__$9) buf__$11.push(function __$lb__$12() {
                var __$r__$13;
                var __$l0__$14 = __$ctx.ctx;
                __$ctx.ctx = ctx__$8[i__$10++];
                __$r__$13 = applyc(__$ctx, __$ref);
                __$ctx.ctx = __$l0__$14;
                return __$r__$13;
            }());
            return buf__$11;
        }

        function __$b6(__$ctx, __$ref) {
            __$ctx.ctx || (__$ctx.ctx = {});
            var vBlock__$15 = __$ctx.ctx.block, vElem__$16 = __$ctx.ctx.elem, block__$17 = __$ctx._currBlock || $$block;
            var __$r__$19;
            var __$l0__$20 = $$mode;
            $$mode = "default";
            var __$l1__$21 = $$block;
            $$block = vBlock__$15 || (vElem__$16 ? block__$17 : undefined);
            var __$l2__$22 = __$ctx._currBlock;
            __$ctx._currBlock = vBlock__$15 || vElem__$16 ? undefined : block__$17;
            var __$l3__$23 = $$elem;
            $$elem = vElem__$16;
            var __$l4__$24 = $$mods;
            $$mods = vBlock__$15 ? __$ctx.ctx.mods || (__$ctx.ctx.mods = {}) : $$mods;
            var __$l5__$25 = $$elemMods;
            $$elemMods = __$ctx.ctx.elemMods || {};
            __$r__$19 = applyc(__$ctx, __$ref);
            $$mode = __$l0__$20;
            $$block = __$l1__$21;
            __$ctx._currBlock = __$l2__$22;
            $$elem = __$l3__$23;
            $$mods = __$l4__$24;
            $$elemMods = __$l5__$25;
            return __$r__$19;
        };
        return exports;
    }
    var defineAsGlobal = true;
    if(typeof exports === "object") {
        exports["BEMTREE"] = __bem_xjst({});
        defineAsGlobal = false;
    }
    if(typeof modules === "object") {
        modules.define("BEMTREE",
            function(provide) {
                provide(__bem_xjst({})) });
        defineAsGlobal = false;
    }
    defineAsGlobal && (g["BEMTREE"] = __bem_xjst({}));
})(this);

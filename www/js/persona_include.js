 /**
 * Uncompressed source can be found at https://login.persona.org/include.orig.js
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
    var a = function() {
        function e(a) {
            return Array.isArray ? Array.isArray(a) : a.constructor.toString().indexOf("Array") != -1
        }
        function d(a, c, d) {
            var e = b[c][d];
            for (var f = 0; f < e.length; f++)
                e[f].win === a && e.splice(f, 1);
            b[c][d].length === 0 && delete b[c][d]
        }
        function c(a, c, d, e) {
            function f(b) {
                for (var c = 0; c < b.length; c++)
                    if (b[c].win === a)
                        return !0;
                return !1
            }
            var g = !1;
            if (c === "*")
                for (var h in b) {
                    if (!b.hasOwnProperty(h))
                        continue;
                    if (h === "*")
                        continue;
                    if (typeof b[h][d] == "object") {
                        g = f(b[h][d]);
                        if (g)
                            break
                    }
                }
            else
                b["*"] && b["*"][d] && (g = f(b["*"][d])), !g && b[c] && b[c][d] && (g = f(b[c][d]));
            if (g)
                throw "A channel is already bound to the same window which overlaps with origin '" + c + "' and has scope '" + d + "'";
            typeof b[c] != "object" && (b[c] = {}), typeof b[c][d] != "object" && (b[c][d] = []), b[c][d].push({win: a,handler: e})
        }
        "use strict";
        var a = Math.floor(Math.random() * 1000001), b = {}, f = {}, g = function(a) {
            try {
                var c = JSON.parse(a.data);
                if (typeof c != "object" || c === null)
                    throw "malformed"
            } catch (a) {
                return
            }
            var d = a.source, e = a.origin, g, h, i;
            if (typeof c.method == "string") {
                var j = c.method.split("::");
                j.length == 2 ? (g = j[0], i = j[1]) : i = c.method
            }
            typeof c.id != "undefined" && (h = c.id);
            if (typeof i == "string") {
                var k = !1;
                if (b[e] && b[e][g])
                    for (var l = 0; l < b[e][g].length; l++)
                        if (b[e][g][l].win === d) {
                            b[e][g][l].handler(e, i, c), k = !0;
                            break
                        }
                if (!k && b["*"] && b["*"][g])
                    for (var l = 0; l < b["*"][g].length; l++)
                        if (b["*"][g][l].win === d) {
                            b["*"][g][l].handler(e, i, c);
                            break
                        }
            } else
                typeof h != "undefined" && f[h] && f[h](e, i, c)
        };
        window.addEventListener ? window.addEventListener("message", g, !1) : window.attachEvent && window.attachEvent("onmessage", g);
        return {build: function(b) {
                var g = function(a) {
                    if (b.debugOutput && window.console && window.console.log) {
                        try {
                            typeof a != "string" && (a = JSON.stringify(a))
                        } catch (c) {
                        }
                        console.log("[" + j + "] " + a)
                    }
                };
                if (!window.postMessage)
                    throw "jschannel cannot run this browser, no postMessage";
                if (!window.JSON || !window.JSON.stringify || !window.JSON.parse)
                    throw "jschannel cannot run this browser, no JSON parsing/serialization";
                if (typeof b != "object")
                    throw "Channel build invoked without a proper object argument";
                if (!b.window || !b.window.postMessage)
                    throw "Channel.build() called without a valid window argument";
                if (window === b.window)
                    throw "target window is same as present window -- not allowed";
                var h = !1;
                if (typeof b.origin == "string") {
                    var i;
                    b.origin === "*" ? h = !0 : null !== (i = b.origin.match(/^https?:\/\/(?:[-a-zA-Z0-9_\.])+(?::\d+)?/)) && (b.origin = i[0].toLowerCase(), h = !0)
                }
                if (!h)
                    throw "Channel.build() called with an invalid origin";
                if (typeof b.scope != "undefined") {
                    if (typeof b.scope != "string")
                        throw "scope, when specified, must be a string";
                    if (b.scope.split("::").length > 1)
                        throw "scope may not contain double colons: '::'"
                }
                var j = function() {
                    var a = "", b = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                    for (var c = 0; c < 5; c++)
                        a += b.charAt(Math.floor(Math.random() * b.length));
                    return a
                }(), k = {}, l = {}, m = {}, n = !1, o = [], p = function(a, b, c) {
                    var d = !1, e = !1;
                    return {origin: b,invoke: function(b, d) {
                            if (!m[a])
                                throw "attempting to invoke a callback of a nonexistent transaction: " + a;
                            var e = !1;
                            for (var f = 0; f < c.length; f++)
                                if (b === c[f]) {
                                    e = !0;
                                    break
                                }
                            if (!e)
                                throw "request supports no such callback '" + b + "'";
                            t({id: a,callback: b,params: d})
                        },error: function(b, c) {
                            e = !0;
                            if (!m[a])
                                throw "error called for nonexistent message: " + a;
                            delete m[a], t({id: a,error: b,message: c})
                        },complete: function(b) {
                            e = !0;
                            if (!m[a])
                                throw "complete called for nonexistent message: " + a;
                            delete m[a], t({id: a,result: b})
                        },delayReturn: function(a) {
                            typeof a == "boolean" && (d = a === !0);
                            return d
                        },completed: function() {
                            return e
                        }}
                }, q = function(a, b, c) {
                    return window.setTimeout(function() {
                        if (l[a]) {
                            var d = "timeout (" + b + "ms) exceeded on method '" + c + "'";
                            (1, l[a].error)("timeout_error", d), delete l[a], delete f[a]
                        }
                    }, b)
                }, r = function(a, c, d) {
                    if (typeof b.gotMessageObserver == "function")
                        try {
                            b.gotMessageObserver(a, d)
                        } catch (h) {
                            g("gotMessageObserver() raised an exception: " + h.toString())
                        }
                    if (d.id && c) {
                        if (k[c]) {
                            var i = p(d.id, a, d.callbacks ? d.callbacks : []);
                            m[d.id] = {};
                            try {
                                if (d.callbacks && e(d.callbacks) && d.callbacks.length > 0)
                                    for (var j = 0; j < d.callbacks.length; j++) {
                                        var n = d.callbacks[j], o = d.params, q = n.split("/");
                                        for (var r = 0; r < q.length - 1; r++) {
                                            var s = q[r];
                                            typeof o[s] != "object" && (o[s] = {}), o = o[s]
                                        }
                                        o[q[q.length - 1]] = function() {
                                            var a = n;
                                            return function(b) {
                                                return i.invoke(a, b)
                                            }
                                        }()
                                    }
                                var t = k[c](i, d.params);
                                !i.delayReturn() && !i.completed() && i.complete(t)
                            } catch (h) {
                                var u = "runtime_error", v = null;
                                typeof h == "string" ? v = h : typeof h == "object" && (h && e(h) && h.length == 2 ? (u = h[0], v = h[1]) : typeof h.error == "string" && (u = h.error, h.message ? typeof h.message == "string" ? v = h.message : h = h.message : v = ""));
                                if (v === null)
                                    try {
                                        v = JSON.stringify(h), typeof v == "undefined" && (v = h.toString())
                                    } catch (w) {
                                        v = h.toString()
                                    }
                                i.error(u, v)
                            }
                        }
                    } else
                        d.id && d.callback ? !l[d.id] || !l[d.id].callbacks || !l[d.id].callbacks[d.callback] ? g("ignoring invalid callback, id:" + d.id + " (" + d.callback + ")") : l[d.id].callbacks[d.callback](d.params) : d.id ? l[d.id] ? (d.error ? (1, l[d.id].error)(d.error, d.message) : d.result !== undefined ? (1, l[d.id].success)(d.result) : (1, l[d.id].success)(), delete l[d.id], delete f[d.id]) : g("ignoring invalid response: " + d.id) : c && k[c] && k[c]({origin: a}, d.params)
                };
                c(b.window, b.origin, typeof b.scope == "string" ? b.scope : "", r);
                var s = function(a) {
                    typeof b.scope == "string" && b.scope.length && (a = [b.scope, a].join("::"));
                    return a
                }, t = function(a, c) {
                    if (!a)
                        throw "postMessage called with null message";
                    var d = n ? "post  " : "queue ";
                    g(d + " message: " + JSON.stringify(a));
                    if (!c && !n)
                        o.push(a);
                    else {
                        if (typeof b.postMessageObserver == "function")
                            try {
                                b.postMessageObserver(b.origin, a)
                            } catch (e) {
                                g("postMessageObserver() raised an exception: " + e.toString())
                            }
                        b.window.postMessage(JSON.stringify(a), b.origin)
                    }
                }, u = function(a, c) {
                    g("ready msg received");
                    if (n)
                        throw "received ready message while in ready state.  help!";
                    c === "ping" ? j += "-R" : j += "-L", v.unbind("__ready"), n = !0, g("ready msg accepted."), c === "ping" && v.notify({method: "__ready",params: "pong"});
                    while (o.length)
                        t(o.pop());
                    typeof b.onReady == "function" && b.onReady(v)
                }, v = {unbind: function(a) {
                        if (k[a]) {
                            if (delete k[a])
                                return !0;
                            throw "can't delete method: " + a
                        }
                        return !1
                    },bind: function(a, b) {
                        if (!a || typeof a != "string")
                            throw "'method' argument to bind must be string";
                        if (!b || typeof b != "function")
                            throw "callback missing from bind params";
                        if (k[a])
                            throw "method '" + a + "' is already bound!";
                        k[a] = b;
                        return this
                    },call: function(b) {
                        if (!b)
                            throw "missing arguments to call function";
                        if (!b.method || typeof b.method != "string")
                            throw "'method' argument to call must be string";
                        if (!b.success || typeof b.success != "function")
                            throw "'success' callback missing from call";
                        var c = {}, d = [], e = function(a, b) {
                            if (typeof b == "object")
                                for (var f in b) {
                                    if (!b.hasOwnProperty(f))
                                        continue;
                                    var g = a + (a.length ? "/" : "") + f;
                                    typeof b[f] == "function" ? (c[g] = b[f], d.push(g), delete b[f]) : typeof b[f] == "object" && e(g, b[f])
                                }
                        };
                        e("", b.params);
                        var g = {id: a,method: s(b.method),params: b.params};
                        d.length && (g.callbacks = d), b.timeout && q(a, b.timeout, s(b.method)), l[a] = {callbacks: c,error: b.error,success: b.success}, f[a] = r, a++, t(g)
                    },notify: function(a) {
                        if (!a)
                            throw "missing arguments to notify function";
                        if (!a.method || typeof a.method != "string")
                            throw "'method' argument to notify must be string";
                        t({method: s(a.method),params: a.params})
                    },destroy: function() {
                        d(b.window, b.origin, typeof b.scope == "string" ? b.scope : ""), window.removeEventListener ? window.removeEventListener("message", r, !1) : window.detachEvent && window.detachEvent("onmessage", r), n = !1, k = {}, m = {}, l = {}, b.origin = null, o = [], g("channel destroyed"), j = ""
                    }};
                v.bind("__ready", u), setTimeout(function() {
                }, 0);
                return v
            }}
    }();
    WinChan = function() {
        function i() {
            var b = window.location, c = window.opener.frames, d = b.protocol + "//" + b.host;
            for (var e = c.length - 1; e >= 0; e--)
                try {
                    if (c[e].location.href.indexOf(d) === 0 && c[e].name === a)
                        return c[e]
                } catch (f) {
                }
            return
        }
        function h(a) {
            /^https?:\/\//.test(a) || (a = window.location.href);
            var b = /^(https?:\/\/[\-_a-zA-Z\.0-9:]+)/.exec(a);
            return b ? b[1] : a
        }
        function g() {
            return window.JSON && window.JSON.stringify && window.JSON.parse && window.postMessage
        }
        function f() {
            try {
                var a = navigator.userAgent;
                return a.indexOf("Fennec/") != -1 || a.indexOf("Firefox/") != -1 && a.indexOf("Android") != -1
            } catch (b) {
            }
            return !1
        }
        function e() {
            var a = -1;
            if (navigator.appName === "Microsoft Internet Explorer") {
                var b = navigator.userAgent, c = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
                c.exec(b) != null && (a = parseFloat(RegExp.$1))
            }
            return a >= 8
        }
        function d(a, b, c) {
            a.detachEvent ? a.detachEvent("on" + b, c) : a.removeEventListener && a.removeEventListener(b, c, !1)
        }
        function c(a, b, c) {
            a.attachEvent ? a.attachEvent("on" + b, c) : a.addEventListener && a.addEventListener(b, c, !1)
        }
        var a = "__winchan_relay_frame", b = "die", j = e();
        return g() ? {open: function(e, g) {
                function q(a) {
                    try {
                        var b = JSON.parse(a.data);
                        b.a === "ready" ? m.postMessage(o, l) : b.a === "error" ? g && (g(b.d), g = null) : b.a === "response" && (d(window, "message", q), d(window, "unload", p), p(), g && (g(null, b.d), g = null))
                    } catch (c) {
                    }
                }
                function p() {
                    k && document.body.removeChild(k), k = undefined;
                    if (n)
                        try {
                            n.close()
                        } catch (a) {
                            m.postMessage(b, l)
                        }
                    n = m = undefined
                }
                if (!g)
                    throw "missing required callback argument";
                var i;
                e.url || (i = "missing required 'url' parameter"), e.relay_url || (i = "missing required 'relay_url' parameter"), i && setTimeout(function() {
                    g(i)
                }, 0), e.window_name || (e.window_name = null);
                if (!e.window_features || f())
                    e.window_features = undefined;
                var k, l = h(e.url);
                if (l !== h(e.relay_url))
                    return setTimeout(function() {
                        g("invalid arguments: origin of url and relay_url must match")
                    }, 0);
                var m;
                j && (k = document.createElement("iframe"), k.setAttribute("src", e.relay_url), k.style.display = "none", k.setAttribute("name", a), document.body.appendChild(k), m = k.contentWindow);
                var n = window.open(e.url, e.window_name, e.window_features);
                m || (m = n);
                var o = JSON.stringify({a: "request",d: e.params});
                c(window, "unload", p), c(window, "message", q);
                return {close: p,focus: function() {
                        if (n)
                            try {
                                n.focus()
                            } catch (a) {
                            }
                    }}
            }} : {open: function(a, b, c, d) {
                setTimeout(function() {
                    d("unsupported browser")
                }, 0)
            }}
    }();
    var b = function() {
        function l() {
            return c
        }
        function k() {
            c = g() || h() || i() || j();
            return !c
        }
        function j() {
            if (!(window.JSON && window.JSON.stringify && window.JSON.parse))
                return "JSON_NOT_SUPPORTED"
        }
        function i() {
            if (!a.postMessage)
                return "POSTMESSAGE_NOT_SUPPORTED"
        }
        function h() {
            try {
                var b = "localStorage" in a && a.localStorage !== null;
                if (b)
                    a.localStorage.setItem("test", "true"), a.localStorage.removeItem("test");
                else
                    return "LOCALSTORAGE_NOT_SUPPORTED"
            } catch (c) {
                return "LOCALSTORAGE_DISABLED"
            }
        }
        function g() {
            return f()
        }
        function f() {
            var a = e(), b = a > -1 && a < 8;
            if (b)
                return "BAD_IE_VERSION"
        }
        function e() {
            var a = -1;
            if (b.appName == "Microsoft Internet Explorer") {
                var c = b.userAgent, d = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
                d.exec(c) != null && (a = parseFloat(RegExp.$1))
            }
            return a
        }
        function d(c, d) {
            b = c, a = d
        }
        var a = window, b = navigator, c;
        return {setTestEnv: d,isSupported: k,getNoSupportReason: l}
    }();
    navigator.id || (navigator.id = {}, navigator.mozId ? navigator.id = navigator.mozId : navigator.id = {});
    if (!navigator.id.request || navigator.id._shimmed) {
        var c = "https://login.persona.org", d = navigator.userAgent, e = d.indexOf("Fennec/") != -1 || d.indexOf("Firefox/") != -1 && d.indexOf("Android") != -1, f = e ? undefined : "menubar=0,location=1,resizable=1,scrollbars=1,status=0,width=700,height=375", g, h = {login: null,logout: null,match: null,ready: null}, i, j = undefined;
        function k(a) {
            a !== !0;
            if (j === undefined)
                j = a;
            else if (j != a)
                throw new Error("you cannot combine the navigator.id.watch() API with navigator.id.getVerifiedEmail() or navigator.id.get()this site should instead use navigator.id.request() and navigator.id.watch()")
        }
        var l, m = !1, n = b.isSupported();
        function o(a) {
            document.addEventListener ? document.addEventListener("DOMContentLoaded", function b() {
                document.removeEventListener("DOMContentLoaded", b), a()
            }, !1) : document.attachEvent && document.readyState && document.attachEvent("onreadystatechange", function c() {
                var b = document.readyState;
                if (b === "loaded" || b === "complete" || b === "interactive")
                    document.detachEvent("onreadystatechange", c), a()
            })
        }
        function p() {
            if (!!n) {
                var b = window.document;
                if (!b.body) {
                    m || (o(p), m = !0);
                    return
                }
                try {
                    if (!l) {
                        var d = b.createElement("iframe");
                        d.style.display = "none", b.body.appendChild(d), d.src = c + "/communication_iframe", l = a.build({window: d.contentWindow,origin: c,scope: "mozid_ni",onReady: function() {
                                l.call({method: "loaded",success: function() {
                                        h.ready && h.ready()
                                    },error: function() {
                                    }})
                            }}), l.bind("logout", function(a, b) {
                            h.logout && h.logout()
                        }), l.bind("login", function(a, b) {
                            h.login && h.login(b)
                        }), l.bind("match", function(a, b) {
                            h.match && h.match()
                        }), q(i) && l.notify({method: "loggedInUser",params: i})
                    }
                } catch (e) {
                    l = undefined
                }
            }
        }
        function q(a) {
            return typeof a != "undefined"
        }
        function r(a) {
            try {
                console.warn(a)
            } catch (b) {
            }
        }
        function s(a, b) {
            if (q(a[b])) {
                r(b + " has been deprecated");
                return !0
            }
        }
        function t(a, b, c) {
            if (q(a[b]) && q(a[c]))
                throw new Error("you cannot supply *both* " + b + " and " + c);
            s(a, b) && (a[c] = a[b], delete a[b])
        }
        function u(a) {
            if (typeof a == "object") {
                if (a.onlogin && typeof a.onlogin != "function" || a.onlogout && typeof a.onlogout != "function" || a.onmatch && typeof a.onmatch != "function" || a.onready && typeof a.onready != "function")
                    throw new Error("non-function where function expected in parameters to navigator.id.watch()");
                if (!a.onlogin)
                    throw new Error("'onlogin' is a required argument to navigator.id.watch()");
                if (!a.onlogout)
                    throw new Error("'onlogout' is a required argument to navigator.id.watch()");
                h.login = a.onlogin || null, h.logout = a.onlogout || null, h.match = a.onmatch || null, h.ready = a.onready || null, t(a, "loggedInEmail", "loggedInUser"), i = a.loggedInUser, p()
            }
        }
        var v;
        function w() {
            var a = v;
            a === "request" && (h.ready ? a = "watch_with_onready" : a = "watch_without_onready");
            return a
        }
        function x(a) {
            s(a, "requiredEmail"), t(a, "tosURL", "termsOfService"), t(a, "privacyURL", "privacyPolicy"), a.termsOfService && !a.privacyPolicy && r("termsOfService ignored unless privacyPolicy also defined"), a.privacyPolicy && !a.termsOfService && r("privacyPolicy ignored unless termsOfService also defined"), a.rp_api = w(), v = null, a.start_time = (new Date).getTime();
            if (g)
                try {
                    g.focus()
                } catch (d) {
                }
            else {
                if (!b.isSupported()) {
                    var e = b.getNoSupportReason(), i = "unsupported_dialog";
                    e === "LOCALSTORAGE_DISABLED" && (i = "cookies_disabled"), g = window.open(c + "/" + i, null, f);
                    return
                }
                l && l.notify({method: "dialog_running"}), g = WinChan.open({url: c + "/sign_in",relay_url: c + "/relay",window_features: f,window_name: "__persona_dialog",params: {method: "get",params: a}}, function(b, c) {
                    l && (!b && c && c.email && l.notify({method: "loggedInUser",params: c.email}), l.notify({method: "dialog_complete"})), g = undefined;
                    if (!b && c && c.assertion)
                        try {
                            h.login && h.login(c.assertion)
                        } catch (d) {
                        }
                    if (b === "client closed window" || !c)
                        a && a.oncancel && a.oncancel(), delete a.oncancel
                })
            }
        }
        navigator.id = {request: function(a) {
                if (this != navigator.id)
                    throw new Error("all navigator.id calls must be made on the navigator.id object");
                if (!h.login)
                    throw new Error("navigator.id.watch must be called before navigator.id.request");
                a = a || {}, k(!1), v = "request", a.returnTo || (a.returnTo = document.location.pathname);
                return x(a)
            },watch: function(a) {
                if (this != navigator.id)
                    throw new Error("all navigator.id calls must be made on the navigator.id object");
                k(!1), u(a)
            },logout: function(a) {
                if (this != navigator.id)
                    throw new Error("all navigator.id calls must be made on the navigator.id object");
                p(), l && l.notify({method: "logout"}), typeof a == "function" && (r("navigator.id.logout callback argument has been deprecated."), setTimeout(a, 0))
            },get: function(a, b) {
                var c = {};
                b = b || {}, c.privacyPolicy = b.privacyPolicy || undefined, c.termsOfService = b.termsOfService || undefined, c.privacyURL = b.privacyURL || undefined, c.tosURL = b.tosURL || undefined, c.siteName = b.siteName || undefined, c.siteLogo = b.siteLogo || undefined, v = v || "get";
                s(b, "silent") ? a && setTimeout(function() {
                    a(null)
                }, 0) : (k(!0), u({onlogin: function(b) {
                        a && (a(b), a = null)
                    },onlogout: function() {
                    }}), c.oncancel = function() {
                    a && (a(null), a = null), h.login = h.logout = h.match = h.ready = null
                }, x(c))
            },getVerifiedEmail: function(a) {
                r("navigator.id.getVerifiedEmail has been deprecated"), k(!0), v = "getVerifiedEmail", navigator.id.get(a)
            },_shimmed: !0}
    }
})()

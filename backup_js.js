! function(e) {
    "function" == typeof define && define.amd ? define(e) : e()
}(function() {
    "use strict";

    function e(e) {
        let t = 0,
            n = 1,
            r = 1;
        return {
            curr: (n = 0) => e[t + n],
            end: () => e.length <= t,
            info: () => ({
                index: t,
                col: n,
                line: r
            }),
            index: e => void 0 === e ? t : t = e,
            next() {
                let s = e[t++];
                return "\n" == s ? (r++, n = 0) : n++, s
            }
        }
    }

    function t(t) {
        t = t.trim();
        let n = [];
        if (!/^var\(/.test(t)) return n;
        let r = e(t);
        try {
            n = function(e) {
                let t = "",
                    n = [],
                    r = [],
                    s = {};
                for (; !e.end();) {
                    let i = e.curr();
                    if ("(" == i) n.push(i), t = "";
                    else if (")" == i || "," == i) {
                        if (/^\-\-.+/.test(t) && (s.name ? (s.alternative || (s.alternative = []), s.alternative.push({
                                name: t
                            })) : s.name = t), ")" == i) {
                            if ("(" != n[n.length - 1]) throw new Error("bad match");
                            n.pop()
                        }
                        "," == i && (n.length || (r.push(s), s = {})), t = ""
                    } else /\s/.test(i) || (t += i);
                    e.next()
                }
                return n.length ? [] : (s.name && r.push(s), r)
            }(r)
        } catch (e) {
            console.error(e && e.message || "Bad variables.")
        }
        return n
    }

    function n(e) {
        return Array.isArray(e) ? e : [e]
    }

    function r(e, t = "\n") {
        return (e || []).join(t)
    }

    function s(e) {
        return e[e.length - 1]
    }

    function i(e) {
        return e[0]
    }

    function l(e, t) {
        return Array.prototype.flatMap ? e.flatMap(t) : e.reduce((e, n) => e.concat(t(n)), [])
    }
    const o = {
            func: (e = "") => ({
                type: "func",
                name: e,
                arguments: []
            }),
            argument: () => ({
                type: "argument",
                value: []
            }),
            text: (e = "") => ({
                type: "text",
                value: e
            }),
            pseudo: (e = "") => ({
                type: "pseudo",
                selector: e,
                styles: []
            }),
            cond: (e = "") => ({
                type: "cond",
                name: e,
                styles: [],
                arguments: []
            }),
            rule: (e = "") => ({
                type: "rule",
                property: e,
                value: []
            }),
            keyframes: (e = "") => ({
                type: "keyframes",
                name: e,
                steps: []
            }),
            step: (e = "") => ({
                type: "step",
                name: e,
                styles: []
            })
        },
        u = {
            white_space: e => /[\s\n\t]/.test(e),
            line_break: e => /\n/.test(e),
            number: e => !isNaN(e),
            pair: e => ['"', "(", ")", "'"].includes(e),
            pair_of: (e, t) => ({
                '"': '"',
                "'": "'",
                "(": ")"
            })[e] == t
        };

    function a(e, {
        col: t,
        line: n
    }) {
        console.error(`(at line ${n}, column ${t}) ${e}`)
    }

    function c(e) {
        return function(t, n) {
            let r = t.index(),
                s = "";
            for (; !t.end();) {
                let n = t.next();
                if (e(n)) break;
                s += n
            }
            return n && t.index(r), s
        }
    }

    function p(e, t) {
        return c(e => /[^\w@]/.test(e))(e, t)
    }

    function h(e) {
        return c(e => /[\s\{]/.test(e))(e)
    }

    function f(e, t) {
        return c(e => u.line_break(e) || "{" == e)(e, t)
    }

    function d(e, t) {
        let n, r = o.step();
        for (; !e.end() && "}" != (n = e.curr());)
            if (u.white_space(n)) e.next();
            else {
                if (r.name.length) {
                    if (r.styles.push(j(e, t)), "}" == e.curr()) break
                } else r.name = k(e);
                e.next()
            }
        return r
    }

    function g(e, t) {
        const n = [];
        let r;
        for (; !e.end() && "}" != (r = e.curr());) u.white_space(r) ? e.next() : (n.push(d(e, t)), e.next());
        return n
    }

    function m(e, t) {
        let n, r = o.keyframes();
        for (; !e.end() && "}" != (n = e.curr());)
            if (r.name.length) {
                if ("{" == n) {
                    e.next(), r.steps = g(e, t);
                    break
                }
                e.next()
            } else if (p(e), r.name = h(e), !r.name.length) {
            a("missing keyframes name", e.info());
            break
        }
        return r
    }

    function y(e, t = {}) {
        for (e.next(); !e.end();) {
            let n = e.curr();
            if (t.inline) {
                if ("\n" == n) break
            } else if ("*" == (n = e.curr()) && "/" == e.curr(1)) break;
            e.next()
        }
        t.inline || (e.next(), e.next())
    }

    function x(e) {
        let t, n = "";
        for (; !e.end() && ":" != (t = e.curr());) u.white_space(t) || (n += t), e.next();
        return n
    }

    function _(e) {
        let t, n = [],
            r = [],
            i = [],
            l = "";
        for (; !e.end();) {
            if (t = e.curr(), /[\('"`]/.test(t) && "\\" !== e.curr(-1)) i.length && "(" != t && t === s(i) ? i.pop() : i.push(t), l += t;
            else if ("@" == t) r.length || (l = l.trimLeft()), l.length && (r.push(o.text(l)), l = ""), r.push(b(e));
            else if (/[,)]/.test(t)) {
                if (i.length) ")" == t && i.pop(), l += t;
                else if (l.length && (r.length ? l.length && r.push(o.text(l)) : r.push(o.text((a = l).trim().length ? u.number(+a) ? +a : a.trim() : a))), n.push(v(r)), [r, l] = [
                        [], ""
                    ], ")" == t) break
            } else l += t;
            e.next()
        }
        var a;
        return n
    }

    function v(e) {
        let t = e.map(e => {
                if ("text" == e.type && "string" == typeof e.value) {
                    let t = String(e.value);
                    t.includes("`") && (e.value = t = t.replace(/`/g, '"')), e.value = t.replace(/\n+|\s+/g, " ")
                }
                return e
            }),
            n = i(t) || {},
            r = s(t) || {};
        if ("text" == n.type && "text" == r.type) {
            let e = i(n.value),
                t = s(r.value);
            "string" == typeof n.value && "string" == typeof r.value && u.pair(e) && u.pair_of(e, t) && (n.value = n.value.slice(1), r.value = r.value.slice(0, r.value.length - 1))
        }
        return t
    }

    function b(e) {
        let t, n = o.func(),
            r = "",
            s = "";
        for (; !e.end() && ")" != (t = e.curr());) {
            if ("(" == t) {
                e.next(), n.name = s, n.arguments = _(e), /\d$/.test(s) && (n.name = s.split(/\d+/)[0], r = s.split(/\D+/)[1]), r.length && n.arguments.unshift([{
                    type: "text",
                    value: r
                }]), n.position = e.info().index;
                break
            }
            s += t, e.next()
        }
        return n
    }

    function $(e) {
        let t, n = o.text(),
            r = 0,
            s = !0;
        const i = [],
            l = [];
        for (i[r] = []; !e.end();)
            if (t = e.curr(), s && u.white_space(t)) e.next();
            else {
                if (s = !1, "\n" != t || u.white_space(e.curr(-1)))
                    if ("," != t || l.length) {
                        if (/[;}]/.test(t)) {
                            n.value.length && (i[r].push(n), n = o.text());
                            break
                        }
                        "@" == t ? (n.value.length && (i[r].push(n), n = o.text()), i[r].push(b(e))) : u.white_space(t) && u.white_space(e.curr(-1)) || ("(" == t && l.push(t), ")" == t && l.pop(), n.value += t)
                    } else n.value.length && (i[r].push(n), n = o.text()), i[++r] = [], s = !0;
                else n.value += " ";
                e.next()
            }
        return n.value.length && i[r].push(n), i
    }

    function k(e) {
        let t, n = "";
        for (; !e.end() && "{" != (t = e.curr());) u.white_space(t) || (n += t), e.next();
        return n
    }

    function z(e) {
        let t, n = {
            name: "",
            arguments: []
        };
        for (; !e.end();) {
            if ("(" == (t = e.curr())) e.next(), n.arguments = _(e);
            else {
                if (/[){]/.test(t)) break;
                u.white_space(t) || (n.name += t)
            }
            e.next()
        }
        return n
    }

    function w(e, t) {
        let n, r = o.pseudo();
        for (; !e.end() && "}" != (n = e.curr());)
            if (u.white_space(n)) e.next();
            else {
                if (r.selector) {
                    let n = j(e, t);
                    if ("@use" == n.property ? r.styles = r.styles.concat(n.value) : r.styles.push(n), "}" == e.curr()) break
                } else r.selector = k(e);
                e.next()
            }
        return r
    }

    function j(e, t) {
        let n, r = o.rule();
        for (; !e.end() && ";" != (n = e.curr());) {
            if (r.property.length) {
                r.value = $(e);
                break
            }
            if (r.property = x(e), "@use" == r.property) {
                r.value = S(e, t);
                break
            }
            e.next()
        }
        return r
    }

    function A(e, t) {
        let n, r = o.cond();
        for (; !e.end() && "}" != (n = e.curr());) {
            if (r.name.length)
                if (":" == n) {
                    let t = w(e);
                    t.selector && r.styles.push(t)
                } else if ("@" != n || f(e, !0).includes(":")) {
                if (!u.white_space(n)) {
                    let n = j(e, t);
                    if (n.property && r.styles.push(n), "}" == e.curr()) break
                }
            } else r.styles.push(A(e));
            else Object.assign(r, z(e));
            e.next()
        }
        return r
    }

    function M(e, t) {
        let n = "";
        return e && e.get_custom_property_value && (n = e.get_custom_property_value(t)), n
    }

    function S(e, n) {
        return e.next(), ($(e) || []).reduce((e, r) => {
            ! function e(n, r) {
                n.forEach && n.forEach(n => {
                    if ("text" == n.type && n.value) {
                        let e = t(n.value);
                        n.value = e.reduce((e, t) => {
                            let n, s = "",
                                i = "";
                            !(s = M(r, t.name)) && t.alternative && t.alternative.every(e => {
                                if (i = M(r, e.name)) return s = i, !1
                            });
                            try {
                                n = C(s, r)
                            } catch (e) {}
                            return n && e.push.apply(e, n), e
                        }, [])
                    }
                    "func" == n.type && n.arguments && n.arguments.forEach(t => {
                        e(t, r)
                    })
                })
            }(r, n);
            let [s] = r;
            return s.value && s.value.length && e.push(...s.value), e
        }, [])
    }

    function C(t, n) {
        const r = e(t),
            s = [];
        for (; !r.end();) {
            let e = r.curr();
            if (u.white_space(e)) r.next();
            else {
                if ("/" == e && "*" == r.curr(1)) y(r);
                else if ("/" == e && "/" == r.curr(1)) y(r, {
                    inline: !0
                });
                else if (":" == e) {
                    let e = w(r, n);
                    e.selector && s.push(e)
                } else if ("@" == e && "@keyframes" === p(r, !0)) {
                    let e = m(r, n);
                    s.push(e)
                } else if ("@" != e || f(r, !0).includes(":")) {
                    if (!u.white_space(e)) {
                        let e = j(r, n);
                        e.property && s.push(e)
                    }
                } else {
                    let e = A(r, n);
                    e.name.length && s.push(e)
                }
                r.next()
            }
        }
        return s
    }

    function E(e, ...t) {
        return t.reduce((e, t) => e.apply(null, n(t)), e)
    }

    function O(e, t, n) {
        return Math.max(t, Math.min(n, e))
    }

    function L(e, t, n) {
        let r = 0,
            s = e,
            i = e => e > 0 && e < 1 ? .1 : 1,
            l = arguments.length;
        1 == l && ([e, t] = [i(e), e]), l < 3 && (n = i(e));
        let o = [];
        for (;
            (n >= 0 && e <= t || n < 0 && e > t) && (o.push(e), e += n, !(r++ >= 1e3)););
        return o.length || o.push(s), o
    }

    function T(e) {
        return /^[a-zA-Z]$/.test(e)
    }

    function H(e) {
        let t = () => e;
        return t.lazy = !0, t
    }

    function N(e, t) {
        let n = [];
        for (let r = 0; r < e; ++r) n.push(t(r));
        return n
    }

    function W(e, t, n) {
        return "cell-" + e + "-" + t + "-" + n
    }
    const [R, D, I] = [1, 32, 1024];

    function q(e) {
        let [t, n, r] = (e + "").replace(/\s+/g, "").replace(/[,，xX]+/g, "x").split("x").map(Number);
        const s = 1 == t || 1 == n ? I : D,
            i = 1 == t && 1 == n ? I : R,
            l = {
                x: O(t || R, 1, s),
                y: O(n || t || R, 1, s),
                z: O(r || R, 1, i)
            };
        return Object.assign({}, l, {
            count: l.x * l.y * l.z
        })
    }

    function P(e, t) {
        if (t) {
            let n = new Blob([e], {
                type: "image/svg+xml"
            });
            return `url(${URL.createObjectURL(n)}#${t})`
        }
        return `url("data:image/svg+xml;utf8,${encodeURIComponent(e)}")`
    }

    function U(e) {
        const t = 'xmlns="http://www.w3.org/2000/svg"';
        return e.includes("<svg") || (e = `<svg ${t}>${e}</svg>`), e.includes("xmlns") || (e = e.replace(/<svg([\s>])/, `<svg ${t}$1`)), e
    }

    function B(e = 0, t = e) {
        return 1 == arguments.length && (e = e < 1 ? .1 : 1),
            function(e, t, n) {
                return e * (1 - n) + t * n
            }(e, t, Math.random())
    }

    function Z(e) {
        return (...t) => {
            let n = function(e) {
                let t = "";
                return e.some(e => {
                    let n = String(e).trim();
                    if (!n) return "";
                    let r = n.match(/\d(\D+)$/);
                    return t = r ? r[1] : ""
                }), t
            }(t);
            return function(e, t) {
                return (...n) => {
                    n = n.map(e => Number(String(e).replace(/\D+$/g, "")));
                    let r = e.apply(null, n);
                    return t.length ? Array.isArray(r) ? r.map(e => e + t) : r + t : r
                }
            }(e, n).apply(null, t)
        }
    }

    function F(e) {
        return (...t) => {
            let n = t.map(e => String(e).charCodeAt(0)),
                r = e.apply(null, n);
            return Array.isArray(r) ? r.map(e => String.fromCharCode(e)) : String.fromCharCode(r)
        }
    }

    function V(e) {
        const t = function(e) {
                let t = function(e) {
                    let t = String(e),
                        n = [],
                        r = "";
                    for (let e = 0; e < t.length; ++e) {
                        let i = t[e];
                        if (X[i])
                            if ("-" == i && "e" == t[e - 1]) r += i;
                            else if (n.length || r.length || !/[+-]/.test(i)) {
                            let {
                                type: e,
                                value: t
                            } = s(n) || {};
                            "operator" == e && !r.length && /[^()]/.test(i) && /[^()]/.test(t) ? r += i : (r.length && (n.push({
                                type: "number",
                                value: r
                            }), r = ""), n.push({
                                type: "operator",
                                value: i
                            }))
                        } else r += i;
                        else /\S/.test(i) && (r += i)
                    }
                    r.length && n.push({
                        type: "number",
                        value: r
                    });
                    return n
                }(e);
                const n = [],
                    r = [];
                for (let e = 0; e < t.length; ++e) {
                    let {
                        type: i,
                        value: l
                    } = t[e];
                    if ("number" == i) r.push(l);
                    else if ("operator" == i)
                        if ("(" == l) n.push(l);
                        else if (")" == l) {
                        for (; n.length && "(" != s(n);) r.push(n.pop());
                        n.pop()
                    } else {
                        for (; n.length && X[s(n)] >= X[l];) {
                            let e = n.pop();
                            /[()]/.test(e) || r.push(e)
                        }
                        n.push(l)
                    }
                }
                for (; n.length;) r.push(n.pop());
                return r
            }(e),
            n = [];
        for (; t.length;) {
            let e = t.shift();
            if (/\d+/.test(e)) n.push(e);
            else {
                let t = n.pop(),
                    r = n.pop();
                n.push(G(e, Number(r), Number(t)))
            }
        }
        return n[0]
    }
    const X = {
        "*": 3,
        "/": 3,
        "%": 3,
        "+": 2,
        "-": 2,
        "(": 1,
        ")": 1
    };

    function G(e, t, n) {
        switch (e) {
            case "+":
                return t + n;
            case "-":
                return t - n;
            case "*":
                return t * n;
            case "/":
                return t / n;
            case "%":
                return t % n
        }
    }
    const J = {};

    function K(e, t) {
        return (...n) => {
            let r = e + n.join("-");
            return J[r] ? J[r] : J[r] = t.apply(null, n)
        }
    }

    function Q(e) {
        return (...t) => e.apply(null, l(t, e => String(e).startsWith("[") ? ee(e) : e))
    }

    function Y(e, t) {
        return {
            type: e,
            value: t
        }
    }
    const ee = K("build_range", e => {
            return l(function(e) {
                let t = String(e),
                    n = [],
                    r = [];
                if (!t.startsWith("[") || !t.endsWith("]")) return n;
                for (let e = 1; e < t.length - 1; ++e) {
                    let i = t[e];
                    if ("-" != i || "-" != t[e - 1])
                        if ("-" != i)
                            if ("-" != s(r)) r.length && n.push(Y("char", r.pop())), r.push(i);
                            else {
                                r.pop();
                                let e = r.pop();
                                n.push(e ? Y("range", [e, i]) : Y("char", i))
                            } else r.push(i)
                }
                return r.length && n.push(Y("char", r.pop())), n
            }(e), ({
                type: e,
                value: t
            }) => {
                if ("char" == e) return t;
                let [n, r] = t, s = !1;
                n > r && ([n, r] = [r, n], s = !0);
                let i = F(L)(n, r);
                return s && i.reverse(), i
            })
        }),
        {
            cos: te,
            sin: ne,
            sqrt: re,
            pow: se,
            PI: ie
        } = Math,
        le = ie / 180;

    function oe(e, t) {
        "function" == typeof arguments[0] && (t = e, e = {}), t || (t = (e => [te(e), ne(e)]));
        let n = e.split || 120,
            r = e.scale || 1,
            s = le * (e.start || 0),
            i = e.deg ? e.deg * le : ie / (n / 2),
            l = [];
        for (let e = 0; e < n; ++e) {
            let n = s + i * e,
                [o, u] = t(n);
            l.push(50 * o * r + 50 + "% " + (50 * u * r + 50) + "%")
        }
        return e.type ? `polygon(${e.type}, ${l.join(",")})` : `polygon(${l.join(",")})`
    }

    function ue(e, t, n) {
        let r = le * n;
        return [e * te(r) - t * ne(r), t * te(r) + e * ne(r)]
    }
    const ae = {
            circle: () => "circle(49%)",
            triangle: () => oe({
                split: 3,
                start: -90
            }, e => [1.1 * te(e), 1.1 * ne(e) + .2]),
            rhombus: () => oe({
                split: 4
            }),
            pentagon: () => oe({
                split: 5,
                start: 54
            }),
            hexgon: () => oe({
                split: 6,
                start: 30
            }),
            hexagon: () => oe({
                split: 6,
                start: 30
            }),
            heptagon: () => oe({
                split: 7,
                start: -90
            }),
            octagon: () => oe({
                split: 8,
                start: 22.5
            }),
            star: () => oe({
                split: 5,
                start: 54,
                deg: 144
            }),
            diamond: () => "polygon(50% 5%, 80% 50%, 50% 95%, 20% 50%)",
            cross: () => "polygon(\n 5% 35%, 35% 35%, 35% 5%, 65% 5%,\n 65% 35%, 95% 35%, 95% 65%, 65% 65%,\n 65% 95%, 35% 95%, 35% 65%, 5% 65%\n )",
            clover: (e = 3) => (4 == (e = O(e, 3, 5)) && (e = 2), oe({
                split: 240
            }, t => {
                let n = te(e * t) * te(t),
                    r = te(e * t) * ne(t);
                return 3 == e && (n -= .2), 2 == e && (n /= 1.1, r /= 1.1), [n, r]
            })),
            hypocycloid(e = 3) {
                let t = 1 - (e = O(e, 3, 6));
                return oe({
                    scale: 1 / e
                }, n => {
                    let r = t * te(n) + te(t * (n - ie)),
                        s = t * ne(n) + ne(t * (n - ie));
                    return 3 == e && (r = 1.1 * r - .6, s *= 1.1), [r, s]
                })
            },
            astroid: () => ae.hypocycloid(4),
            infinity: () => oe(e => {
                let t = .7 * re(2) * te(e),
                    n = se(ne(e), 2) + 1;
                return [t / n, t * ne(e) / n]
            }),
            heart: () => oe(e => {
                return ue(1.2 * (.75 * se(ne(e), 3)), 1.1 * (te(1 * e) * (13 / 18) - te(2 * e) * (5 / 18) - te(3 * e) / 18 - te(4 * e) / 18 + .2), 180)
            }),
            bean: () => oe(e => {
                let [t, n] = [se(ne(e), 3), se(te(e), 3)];
                return ue((t + n) * te(e) * 1.3 - .45, (t + n) * ne(e) * 1.3 - .45, -90)
            }),
            bicorn: () => oe(e => ue(te(e), se(ne(e), 2) / (2 + ne(e)) - .5, 180)),
            pear: () => oe(e => [ne(e), (1 + ne(e)) * te(e) / 1.4]),
            fish: () => oe(e => [te(e) - se(ne(e), 2) / re(2), ne(2 * e) / 2]),
            whale: () => oe({
                split: 240
            }, e => {
                let t = 3.4 * (se(ne(e), 2) - .5) * te(e);
                return ue(te(e) * t + .75, ne(e) * t * 1.2, 180)
            }),
            bud: (e = 3) => (e = O(e, 3, 10), oe({
                split: 240
            }, t => [(1 + .2 * te(e * t)) * te(t) * .8, (1 + .2 * te(e * t)) * ne(t) * .8])),
            alien(...e) {
                let [t = 1, n = 1, r = 1, s = 1, i = 1] = e.map(e => O(e, 1, 9));
                return oe({
                    split: 480,
                    type: "evenodd"
                }, e => [.31 * (te(e * t) + te(e * r) + te(e * i)), .31 * (ne(e * n) + ne(e * s) + ne(e))])
            }
        },
        ce = {
            index: ({
                count: e
            }) => t => e,
            row: ({
                x: e
            }) => t => e,
            col: ({
                y: e
            }) => t => e,
            depth: ({
                z: e
            }) => t => e,
            size: ({
                grid: e
            }) => t => e.count,
            "size-row": ({
                grid: e
            }) => t => e.x,
            "size-col": ({
                grid: e
            }) => t => e.y,
            "size-depth": ({
                grid: e
            }) => t => e.z,
            n: ({
                idx: e
            }) => t => e || 0,
            pick: ({
                context: e
            }) => Q((...t) => e.last_pick = function(...e) {
                let t = e.reduce((e, t) => e.concat(t), []);
                return t[~~(Math.random() * t.length)]
            }(t)),
            "pick-n" ({
                idx: e,
                context: t,
                position: n
            }) {
                let r = "pn-counter" + n;
                return Q((...n) => {
                    t[r] || (t[r] = 0), t[r] += 1;
                    let s = n.length,
                        i = ((void 0 === e ? t[r] : e) - 1) % s;
                    return t.last_pick = n[i]
                })
            },
            "pick-d" ({
                idx: e,
                context: t,
                position: n
            }) {
                let r = "pd-counter" + n,
                    s = "pd-values" + n;
                return Q((...n) => {
                    t[r] || (t[r] = 0), t[r] += 1, t[s] || (t[s] = function(e) {
                        let t = Array.from ? Array.from(e) : e.slice(),
                            n = e.length;
                        for (; n;) {
                            let e = ~~(Math.random() * n--),
                                r = t[n];
                            t[n] = t[e], t[e] = r
                        }
                        return t
                    }(n));
                    let i = n.length,
                        l = ((void 0 === e ? t[r] : e) - 1) % i;
                    return t.last_pick = t[s][l]
                })
            },
            "last-pick": ({
                context: e
            }) => () => e.last_pick,
            multiple: H((e, t) => {
                if (!t || !e) return "";
                return N(O(e(), 0, 65536), e => t(e + 1)).join(",")
            }),
            "multiple-with-space": H((e, t) => {
                if (!t || !e) return "";
                return N(O(e(), 0, 65536), e => t(e + 1)).join(" ")
            }),
            repeat: H((e, t) => {
                if (!t || !e) return "";
                return N(O(e(), 0, 65536), e => t(e + 1)).join("")
            }),
            rand: ({
                context: e
            }) => (...t) => {
                let n = (t.every(T) ? F : Z)(B).apply(null, t);
                return e.last_rand = n
            },
            "rand-int": ({
                context: e
            }) => (...t) => {
                let n = t.every(T) ? F : Z,
                    r = parseInt(n(B).apply(null, t));
                return e.last_rand = r
            },
            "last-rand": ({
                context: e
            }) => () => e.last_rand,
            calc: () => e => V(e),
            hex: () => e => parseInt(e).toString(16),
            svg: H(e => {
                if (void 0 === e) return "";
                return P(U(e().trim()))
            }),
            "svg-filter": H(e => {
                if (void 0 === e) return "";
                let t = function(e = "") {
                    return e + Math.random().toString(32).substr(2)
                }("filter-");
                return P(U(e().trim()).replace(/<filter([\s>])/, `<filter id="${t}"$1`), t)
            }),
            var: () => e => `var(${e})`,
            shape: () => memo("shape-function", (e = "", ...t) => (e = e.trim(), "function" == typeof ae[e] ? ae[e](t) : ""))
        };
    var pe, he, fe = (pe = ce, he = {
        m: "multiple",
        ms: "multiple-with-space",
        r: "rand",
        ri: "rand-int",
        lr: "last-rand",
        p: "pick",
        pn: "pick-n",
        pd: "pick-d",
        lp: "last-pick",
        i: "index",
        x: "row",
        y: "col",
        z: "depth",
        "size-x": "size-row",
        "size-y": "size-col",
        "size-z": "size-depth",
        multi: "multiple",
        "pick-by-turn": "pick-n",
        "max-row": "size-row",
        "max-col": "size-col"
    }, Object.keys(he).forEach(e => {
        pe[e] = pe[he[e]]
    }), pe);
    const de = e => /[,，\s]/.test(e);

    function ge(e) {
        for (; !e.end() && de(e.curr(1));) e.next()
    }

    function me(t) {
        const n = e(t),
            r = [],
            s = [];
        let i = "";
        for (; !n.end();) {
            let e = n.curr();
            "(" == e ? (i += e, s.push(e)) : ")" == e ? (i += e, s.length && s.pop()) : s.length ? i += e : de(e) ? (r.push(i), i = "", ge(n)) : i += e, n.next()
        }
        return i && r.push(i), r
    }
    let ye = [];

    function xe(e) {
        if (!ye.length) {
            let e = new Set;
            for (let t in document.head.style) t.startsWith("-") || e.add(t.replace(/[A-Z]/g, "-$&").toLowerCase());
            e.has("grid-gap") || e.add("grid-gap"), ye = Array.from(e)
        }
        return e && e.test ? ye.filter(t => e.test(t)) : ye
    }

    function _e(e) {
        let t = new RegExp(`\\-?${e}\\-?`);
        return xe(t).map(e => e.replace(t, "")).reduce((e, t) => (e[t] = t, e), {})
    }
    const ve = _e("webkit"),
        be = _e("moz");

    function $e(e, t) {
        return ve[e] ? `-webkit-${t}${t}` : be[e] ? `-moz-${t}${t}` : t
    }
    var ke = {
        "@size" (e, {
            is_special_selector: t
        }) {
            let [n, r = n] = me(e);
            return `\n width:${n};height:${r};${t?"":`\
            n--internal - cell - width: $ {
                n
            };
            --internal - cell - height: $ {
                r
            };
            `}`
        }, "@min-size" (e) {
            let [t, n = t] = me(e);
            return `min-width:${t};min-height:${n};`
        }, "@max-size" (e) {
            let [t, n = t] = me(e);
            return `max-width:${t};max-height:${n};`
        }, "@place-cell": (() => {
            let e = {
                    center: "50%",
                    0: "0%",
                    left: "0%",
                    right: "100%",
                    top: "50%",
                    bottom: "50%"
                },
                t = {
                    center: "50%",
                    0: "0%",
                    top: "0%",
                    bottom: "100%",
                    left: "50%",
                    right: "50%"
                };
            return n => {
                let [r, s = "50%"] = me(n);
                const i = "var(--internal-cell-width, 25%)",
                    l = "var(--internal-cell-height, 25%)";
                return `\n position:absolute;left:${r=e[r]||r};top:${s=t[s]||s};width:${i};height:${l};margin-left:calc(${i}/ -2) !important;margin-top:calc(${l}/ -2) !important;grid-area:unset !important;`
            }
        })(), "@grid" (e, t) {
            let [n, r] = e.split("/").map(e => e.trim());
            return {
                grid: q(n),
                size: r ? this["@size"](r, t) : ""
            }
        }, "@shape": K("shape-property", e => {
            let [t, ...n] = me(e);
            return ae[t] ? $e("clip-path", `clip-path:${ae[t].apply(null,n)};`) + "overflow:hidden;" : ""
        }), "@use" (e) {
            if (e.length > 2) return e
        }
    };

    function ze(e, t, n) {
        let r = function(e) {
            return t => String(e).replace(/(\d+)(n)/g, "$1*" + t).replace(/n/g, t)
        }(e);
        for (let e = 0; e <= n; ++e)
            if (V(r(e)) == t) return !0
    }
    const we = {
        even: e => !!(e % 2),
        odd: e => !(e % 2)
    };

    function je(e) {
        return /^(even|odd)$/.test(e)
    }
    var Ae = {
        at: ({
            x: e,
            y: t
        }) => (n, r) => e == n && t == r,
        nth: ({
            count: e,
            grid: t
        }) => (...n) => n.some(n => je(n) ? we[n](e - 1) : ze(n, e, t.count)),
        row: ({
            x: e,
            grid: t
        }) => (...n) => n.some(n => je(n) ? we[n](e - 1) : ze(n, e, t.x)),
        col: ({
            y: e,
            grid: t
        }) => (...n) => n.some(n => je(n) ? we[n](e - 1) : ze(n, e, t.y)),
        even: ({
            count: e
        }) => t => we.even(e - 1),
        odd: ({
            count: e
        }) => t => we.odd(e - 1),
        random: () => (e = .5) => (e >= 1 && e <= 0 && (e = .5), Math.random() < e)
    };
    var Me = Object.getOwnPropertyNames(Math).reduce((e, t) => (e[t] = (() => (...e) => "number" == typeof Math[t] ? Math[t] : Math[t].apply(null, e.map(V))), e), {});

    function Se(e) {
        return /^\:(host|doodle)/.test(e)
    }

    function Ce(e) {
        return /^\:(container|parent)/.test(e)
    }

    function Ee(e) {
        return Se(e) || Ce(e)
    }
    class Oe {
        constructor(e) {
            this.tokens = e, this.rules = {}, this.props = {}, this.keyframes = {}, this.grid = null, this.coords = [], this.reset()
        }
        reset() {
            this.styles = {
                host: "",
                container: "",
                cells: "",
                keyframes: ""
            }, this.coords = [];
            for (let e in this.rules) e.startsWith("#cell") && delete this.rules[e]
        }
        add_rule(e, t) {
            let r = this.rules[e];
            r || (r = this.rules[e] = []), r.push.apply(r, n(t))
        }
        pick_func(e) {
            return fe[e] || Me[e]
        }
        compose_aname(...e) {
            return e.join("-")
        }
        compose_selector({
            x: e,
            y: t,
            z: n
        }, r = "") {
            return `#${W(e,t,n)}${r}`
        }
        compose_argument(e, t, n) {
            let r = e.map(e => {
                if ("text" == e.type) return e.value;
                if ("func" == e.type) {
                    let r = this.pick_func(e.name.substr(1));
                    if (r) {
                        t.idx = n, t.position = e.position;
                        let s = e.arguments.map(e => r.lazy ? n => this.compose_argument(e, t, n) : this.compose_argument(e, t, n));
                        return E(r, t, s)
                    }
                }
            });
            return r.length >= 2 ? r.join("") : r[0]
        }
        compose_value(e, t) {
            return e && e.reduce ? e.reduce((e, n) => {
                switch (n.type) {
                    case "text":
                        e += n.value;
                        break;
                    case "func":
                        {
                            let r = n.name.substr(1),
                                s = this.pick_func(r);
                            if (s) {
                                t.position = n.position;
                                let r = n.arguments.map(e => s.lazy ? n => this.compose_argument(e, t, n) : this.compose_argument(e, t));
                                e += E(s, t, r)
                            }
                        }
                }
                return e
            }, "") : ""
        }
        compose_rule(e, t, n) {
            let r = Object.assign({}, t),
                s = e.property,
                i = e.value.reduce((e, t) => {
                    let n = this.compose_value(t, r);
                    return n && e.push(n), e
                }, []),
                l = i.join(", ");
            if (/^animation(\-name)?$/.test(s) && (this.props.has_animation = !0, r.count > 1)) {
                let {
                    count: e
                } = r;
                switch (s) {
                    case "animation-name":
                        l = i.map(t => this.compose_aname(t, e)).join(", ");
                        break;
                    case "animation":
                        l = i.map(t => {
                            let n = (t || "").split(/\s+/);
                            return n[0] = this.compose_aname(n[0], e), n.join(" ")
                        }).join(", ")
                }
            }
            "content" == s && (/["']|^none$|^(var|counter|counters|attr)\(/.test(l) || (l = `'${l}'`)), "transition" == s && (this.props.has_transition = !0);
            let o = `${s}:${l};`;
            if (o = $e(s, o), "clip-path" == s && (o += ";overflow:hidden;"), "width" != s && "height" != s || Ee(n) || (o += `--internal-cell-${s}:${l};`), ke[s]) {
                let t = ke[s](l, {
                    is_special_selector: Ee(n)
                });
                switch (s) {
                    case "@grid":
                        Se(n) && (this.grid = t.grid, o = t.size || "");
                        break;
                    case "@place-cell":
                        Se(n) || (o = t);
                    case "@use":
                        e.value.length && this.compose(r, e.value), o = ke[s](e.value);
                    default:
                        o = t
                }
            }
            return o
        }
        compose(e, t) {
            this.coords.push(e), (t || this.tokens).forEach((t, n) => {
                if (t.skip) return !1;
                switch (t.type) {
                    case "rule":
                        this.add_rule(this.compose_selector(e), this.compose_rule(t, e));
                        break;
                    case "pseudo":
                        {
                            t.selector.startsWith(":doodle") && (t.selector = t.selector.replace(/^\:+doodle/, ":host"));
                            let n = Ee(t.selector);
                            n && (t.skip = !0), t.selector.split(",").forEach(r => {
                                let s = t.styles.map(t => this.compose_rule(t, e, r)),
                                    i = n ? r : this.compose_selector(e, r);
                                this.add_rule(i, s)
                            });
                            break
                        }
                    case "cond":
                        {
                            let n = Ae[t.name.substr(1)];
                            if (n) {
                                let r = t.arguments.map(t => this.compose_argument(t, e));
                                E(n, e, r) && this.compose(e, t.styles)
                            }
                            break
                        }
                    case "keyframes":
                        this.keyframes[t.name] || (this.keyframes[t.name] = (e => `\n ${r(t.steps.map(t=>`\
                            n $ {
                                t.name
                            } {
                                $ {
                                    r(t.styles.map(t => this.compose_rule(t, e)))
                                }
                            }
                            `))}`))
                }
            })
        }
        output() {
            Object.keys(this.rules).forEach((e, t) => {
                if (Ce(e)) this.styles.container += `\n .container{${r(this.rules[e])}}`;
                else {
                    let t = Se(e) ? "host" : "cells";
                    this.styles[t] += `\n ${e}{${r(this.rules[e])}}`
                }
            });
            let e = Object.keys(this.keyframes);
            return this.coords.forEach((t, n) => {
                e.forEach(e => {
                    let r = this.compose_aname(e, t.count);
                    this.styles.keyframes += `\n ${function(e,t){return e?"function"==typeof t?t():t:""}(0==n,`
                    @keyframes $ {
                        e
                    } {
                        $ {
                            this.keyframes[e](t)
                        }
                    }
                    `)}@keyframes ${r}{${this.keyframes[e](t)}}`
                })
            }), {
                props: this.props,
                styles: this.styles,
                grid: this.grid
            }
        }
    }

    function Le(e, t) {
        let n = new Oe(e),
            r = {};
        n.compose({
            x: 1,
            y: 1,
            z: 1,
            count: 1,
            context: {},
            grid: {
                x: 1,
                y: 1,
                z: 1,
                count: 1
            }
        });
        let {
            grid: s
        } = n.output();
        if (s && (t = s), n.reset(), 1 == t.z)
            for (let e = 1, s = 0; e <= t.x; ++e)
                for (let i = 1; i <= t.y; ++i) n.compose({
                    x: e,
                    y: i,
                    z: 1,
                    count: ++s,
                    grid: t,
                    context: r
                });
        else
            for (let e = 1, s = 0; e <= t.z; ++e) n.compose({
                x: 1,
                y: 1,
                z: e,
                count: ++s,
                grid: t,
                context: r
            });
        return n.output()
    }
    customElements.define("css-doodle", class extends HTMLElement {
        constructor() {
            super(), this.doodle = this.attachShadow({
                mode: "open"
            }), this.extra = {
                get_custom_property_value: this.get_custom_property_value.bind(this)
            }
        }
        connectedCallback() {
            setTimeout(() => {
                let e, t = this.getAttribute("use") || "";
                if (t && (t = `@use:${t};`), !this.innerHTML.trim() && !t) return !1;
                try {
                    let n = C(t + this.innerHTML, this.extra);
                    this.grid_size = q(this.getAttribute("grid")), (e = Le(n, this.grid_size)).grid && (this.grid_size = e.grid), this.build_grid(e)
                } catch (e) {
                    this.innerHTML = "", console.error(e && e.message || "Error in css-doodle.")
                }
            })
        }
        get_custom_property_value(e) {
            return getComputedStyle(this).getPropertyValue(e).trim().replace(/^\(|\)$/g, "")
        }
        cell(e, t, n) {
            let r = document.createElement("div");
            return r.id = W(e, t, n), r
        }
        build_grid(e) {
            const {
                has_transition: t,
                has_animation: n
            } = e.props, {
                keyframes: r,
                host: s,
                container: i,
                cells: l
            } = e.styles;
            this.doodle.innerHTML = `\n<style>${this.style_basic()}</style><style class="style-keyframes">${r}</style><style class="style-container">${this.style_size()}${s}${i}</style><style class="style-cells">${t||n?"":l}</style><div class="container"></div>`, this.doodle.querySelector(".container").appendChild(this.html_cells()), (t || n) && setTimeout(() => {
                this.set_style(".style-cells", l)
            }, 50)
        }
        inherit_props(e) {
            return xe(/grid/).map(e => `${e}:inherit;`).join("")
        }
        style_basic() {
            return `\n:host{display:block;visibility:visible;width:1em;height:1em;}.container{position:relative;width:100%;height:100%;display:grid;${this.inherit_props()}}.container div:empty{position:relative;line-height:1;box-sizing:border-box;display:flex;justify-content:center;align-items:center;}`
        }
        style_size() {
            let {
                x: e,
                y: t
            } = this.grid_size;
            return `\n:host{grid-template-rows:repeat(${e}, 1fr);grid-template-columns:repeat(${t}, 1fr);}`
        }
        html_cells() {
            let {
                x: e,
                y: t,
                z: n
            } = this.grid_size, r = document.createDocumentFragment();
            if (1 == n)
                for (let n = 1; n <= e; ++n)
                    for (let e = 1; e <= t; ++e) r.appendChild(this.cell(n, e, 1));
            else {
                let e = null;
                for (let t = 1; t <= n; ++t) {
                    let n = this.cell(1, 1, t);
                    (e || r).appendChild(n), e = n
                }
                e = null
            }
            return r
        }
        set_style(e, t) {
            const n = this.shadowRoot.querySelector(e);
            n && (n.styleSheet ? n.styleSheet.cssText = t : n.innerHTML = t)
        }
        update(e) {
            let t = this.getAttribute("use") || "";
            t && (t = `@use:${t};`), e || (e = this.innerHTML), this.innerHTML = e, this.grid_size || (this.grid_size = q(this.getAttribute("grid")));
            const n = Le(C(t + e, this.extra), this.grid_size);
            if (n.grid) {
                let {
                    x: e,
                    y: t,
                    z: r
                } = n.grid, {
                    x: s,
                    y: i,
                    z: l
                } = this.grid_size;
                if (s !== e || i !== t || l !== r) return Object.assign(this.grid_size, n.grid), this.build_grid(n);
                Object.assign(this.grid_size, n.grid)
            } else {
                let n = q(this.getAttribute("grid")),
                    {
                        x: r,
                        y: s,
                        z: i
                    } = n,
                    {
                        x: l,
                        y: o,
                        z: u
                    } = this.grid_size;
                if (l !== r || o !== s || u !== i) return Object.assign(this.grid_size, n), this.build_grid(Le(C(t + e, this.extra), this.grid_size))
            }
            this.set_style(".style-keyframes", n.styles.keyframes), n.props.has_animation && (this.set_style(".style-cells", ""), this.set_style(".style-container", "")), setTimeout(() => {
                this.set_style(".style-container", this.style_size() + n.styles.host + n.styles.container), this.set_style(".style-cells", n.styles.cells)
            })
        }
        get grid() {
            return Object.assign({}, this.grid_size)
        }
        set grid(e) {
            this.setAttribute("grid", e), this.connectedCallback()
        }
        get use() {
            return this.getAttribute("use")
        }
        set use(e) {
            this.setAttribute("use", e), this.connectedCallback()
        }
        static get observedAttributes() {
            return ["grid", "use"]
        }
        attributeChangedCallback(e, t, n) {
            if (t == n) return !1;
            "grid" == e && t && (this.grid = n), "use" == e && t && (this.use = n)
        }
    })
});
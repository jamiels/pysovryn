"use client";
import {
  h,
  j,
  m,
  u
} from "./chunk-57RRUQPG.js";
import {
  require_react
} from "./chunk-W4EHDCLL.js";
import {
  __toESM
} from "./chunk-EWTE5DHJ.js";

// node_modules/react-hot-toast/dist/index.mjs
var import_react = __toESM(require_react(), 1);
var import_react2 = __toESM(require_react(), 1);
var l = __toESM(require_react(), 1);
var g = __toESM(require_react(), 1);
var T = __toESM(require_react(), 1);
var W = (e) => typeof e == "function";
var f = (e, t) => W(e) ? e(t) : e;
var F = /* @__PURE__ */ (() => {
  let e = 0;
  return () => (++e).toString();
})();
var A = /* @__PURE__ */ (() => {
  let e;
  return () => {
    if (e === void 0 && typeof window < "u") {
      let t = matchMedia("(prefers-reduced-motion: reduce)");
      e = !t || t.matches;
    }
    return e;
  };
})();
var Y = 20;
var U = (e, t) => {
  switch (t.type) {
    case 0:
      return { ...e, toasts: [t.toast, ...e.toasts].slice(0, Y) };
    case 1:
      return { ...e, toasts: e.toasts.map((o) => o.id === t.toast.id ? { ...o, ...t.toast } : o) };
    case 2:
      let { toast: r } = t;
      return U(e, { type: e.toasts.find((o) => o.id === r.id) ? 1 : 0, toast: r });
    case 3:
      let { toastId: s } = t;
      return { ...e, toasts: e.toasts.map((o) => o.id === s || s === void 0 ? { ...o, dismissed: true, visible: false } : o) };
    case 4:
      return t.toastId === void 0 ? { ...e, toasts: [] } : { ...e, toasts: e.toasts.filter((o) => o.id !== t.toastId) };
    case 5:
      return { ...e, pausedAt: t.time };
    case 6:
      let a = t.time - (e.pausedAt || 0);
      return { ...e, pausedAt: void 0, toasts: e.toasts.map((o) => ({ ...o, pauseDuration: o.pauseDuration + a })) };
  }
};
var P = [];
var y = { toasts: [], pausedAt: void 0 };
var u2 = (e) => {
  y = U(y, e), P.forEach((t) => {
    t(y);
  });
};
var q = { blank: 4e3, error: 4e3, success: 2e3, loading: 1 / 0, custom: 4e3 };
var D = (e = {}) => {
  let [t, r] = (0, import_react.useState)(y), s = (0, import_react.useRef)(y);
  (0, import_react.useEffect)(() => (s.current !== y && r(y), P.push(r), () => {
    let o = P.indexOf(r);
    o > -1 && P.splice(o, 1);
  }), []);
  let a = t.toasts.map((o) => {
    var n, i, p;
    return { ...e, ...e[o.type], ...o, removeDelay: o.removeDelay || ((n = e[o.type]) == null ? void 0 : n.removeDelay) || (e == null ? void 0 : e.removeDelay), duration: o.duration || ((i = e[o.type]) == null ? void 0 : i.duration) || (e == null ? void 0 : e.duration) || q[o.type], style: { ...e.style, ...(p = e[o.type]) == null ? void 0 : p.style, ...o.style } };
  });
  return { ...t, toasts: a };
};
var J = (e, t = "blank", r) => ({ createdAt: Date.now(), visible: true, dismissed: false, type: t, ariaProps: { role: "status", "aria-live": "polite" }, message: e, pauseDuration: 0, ...r, id: (r == null ? void 0 : r.id) || F() });
var x = (e) => (t, r) => {
  let s = J(t, e, r);
  return u2({ type: 2, toast: s }), s.id;
};
var c = (e, t) => x("blank")(e, t);
c.error = x("error");
c.success = x("success");
c.loading = x("loading");
c.custom = x("custom");
c.dismiss = (e) => {
  u2({ type: 3, toastId: e });
};
c.remove = (e) => u2({ type: 4, toastId: e });
c.promise = (e, t, r) => {
  let s = c.loading(t.loading, { ...r, ...r == null ? void 0 : r.loading });
  return typeof e == "function" && (e = e()), e.then((a) => {
    let o = t.success ? f(t.success, a) : void 0;
    return o ? c.success(o, { id: s, ...r, ...r == null ? void 0 : r.success }) : c.dismiss(s), a;
  }).catch((a) => {
    let o = t.error ? f(t.error, a) : void 0;
    o ? c.error(o, { id: s, ...r, ...r == null ? void 0 : r.error }) : c.dismiss(s);
  }), e;
};
var K = (e, t) => {
  u2({ type: 1, toast: { id: e, height: t } });
};
var X = () => {
  u2({ type: 5, time: Date.now() });
};
var b = /* @__PURE__ */ new Map();
var Z = 1e3;
var ee = (e, t = Z) => {
  if (b.has(e)) return;
  let r = setTimeout(() => {
    b.delete(e), u2({ type: 4, toastId: e });
  }, t);
  b.set(e, r);
};
var O = (e) => {
  let { toasts: t, pausedAt: r } = D(e);
  (0, import_react2.useEffect)(() => {
    if (r) return;
    let o = Date.now(), n = t.map((i) => {
      if (i.duration === 1 / 0) return;
      let p = (i.duration || 0) + i.pauseDuration - (o - i.createdAt);
      if (p < 0) {
        i.visible && c.dismiss(i.id);
        return;
      }
      return setTimeout(() => c.dismiss(i.id), p);
    });
    return () => {
      n.forEach((i) => i && clearTimeout(i));
    };
  }, [t, r]);
  let s = (0, import_react2.useCallback)(() => {
    r && u2({ type: 6, time: Date.now() });
  }, [r]), a = (0, import_react2.useCallback)((o, n) => {
    let { reverseOrder: i = false, gutter: p = 8, defaultPosition: d } = n || {}, h2 = t.filter((m2) => (m2.position || d) === (o.position || d) && m2.height), v = h2.findIndex((m2) => m2.id === o.id), S = h2.filter((m2, E) => E < v && m2.visible).length;
    return h2.filter((m2) => m2.visible).slice(...i ? [S + 1] : [0, S]).reduce((m2, E) => m2 + (E.height || 0) + p, 0);
  }, [t]);
  return (0, import_react2.useEffect)(() => {
    t.forEach((o) => {
      if (o.dismissed) ee(o.id, o.removeDelay);
      else {
        let n = b.get(o.id);
        n && (clearTimeout(n), b.delete(o.id));
      }
    });
  }, [t]), { toasts: t, handlers: { updateHeight: K, startPause: X, endPause: s, calculateOffset: a } };
};
var oe = h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`;
var re = h`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`;
var se = h`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`;
var k = j("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${(e) => e.primary || "#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${oe} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${re} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${(e) => e.secondary || "#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${se} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`;
var ne = h`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
var V = j("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${(e) => e.secondary || "#e0e0e0"};
  border-right-color: ${(e) => e.primary || "#616161"};
  animation: ${ne} 1s linear infinite;
`;
var pe = h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`;
var de = h`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`;
var _ = j("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${(e) => e.primary || "#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${pe} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${de} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${(e) => e.secondary || "#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`;
var ue = j("div")`
  position: absolute;
`;
var le = j("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`;
var fe = h`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`;
var Te = j("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${fe} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`;
var M = ({ toast: e }) => {
  let { icon: t, type: r, iconTheme: s } = e;
  return t !== void 0 ? typeof t == "string" ? g.createElement(Te, null, t) : t : r === "blank" ? null : g.createElement(le, null, g.createElement(V, { ...s }), r !== "loading" && g.createElement(ue, null, r === "error" ? g.createElement(k, { ...s }) : g.createElement(_, { ...s })));
};
var ye = (e) => `
0% {transform: translate3d(0,${e * -200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`;
var ge = (e) => `
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e * -150}%,-1px) scale(.6); opacity:0;}
`;
var he = "0%{opacity:0;} 100%{opacity:1;}";
var xe = "0%{opacity:1;} 100%{opacity:0;}";
var be = j("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`;
var Se = j("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`;
var Ae = (e, t) => {
  let s = e.includes("top") ? 1 : -1, [a, o] = A() ? [he, xe] : [ye(s), ge(s)];
  return { animation: t ? `${h(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards` : `${h(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)` };
};
var C = l.memo(({ toast: e, position: t, style: r, children: s }) => {
  let a = e.height ? Ae(e.position || t || "top-center", e.visible) : { opacity: 0 }, o = l.createElement(M, { toast: e }), n = l.createElement(Se, { ...e.ariaProps }, f(e.message, e));
  return l.createElement(be, { className: e.className, style: { ...a, ...r, ...e.style } }, typeof s == "function" ? s({ icon: o, message: n }) : l.createElement(l.Fragment, null, o, n));
});
m(T.createElement);
var ve = ({ id: e, className: t, style: r, onHeightUpdate: s, children: a }) => {
  let o = T.useCallback((n) => {
    if (n) {
      let i = () => {
        let p = n.getBoundingClientRect().height;
        s(e, p);
      };
      i(), new MutationObserver(i).observe(n, { subtree: true, childList: true, characterData: true });
    }
  }, [e, s]);
  return T.createElement("div", { ref: o, className: t, style: r }, a);
};
var Ee = (e, t) => {
  let r = e.includes("top"), s = r ? { top: 0 } : { bottom: 0 }, a = e.includes("center") ? { justifyContent: "center" } : e.includes("right") ? { justifyContent: "flex-end" } : {};
  return { left: 0, right: 0, display: "flex", position: "absolute", transition: A() ? void 0 : "all 230ms cubic-bezier(.21,1.02,.73,1)", transform: `translateY(${t * (r ? 1 : -1)}px)`, ...s, ...a };
};
var De = u`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;
var R = 16;
var Oe = ({ reverseOrder: e, position: t = "top-center", toastOptions: r, gutter: s, children: a, containerStyle: o, containerClassName: n }) => {
  let { toasts: i, handlers: p } = O(r);
  return T.createElement("div", { id: "_rht_toaster", style: { position: "fixed", zIndex: 9999, top: R, left: R, right: R, bottom: R, pointerEvents: "none", ...o }, className: n, onMouseEnter: p.startPause, onMouseLeave: p.endPause }, i.map((d) => {
    let h2 = d.position || t, v = p.calculateOffset(d, { reverseOrder: e, gutter: s, defaultPosition: t }), S = Ee(h2, v);
    return T.createElement(ve, { id: d.id, key: d.id, onHeightUpdate: p.updateHeight, className: d.visible ? De : "", style: S }, d.type === "custom" ? f(d.message, d) : a ? a(d) : T.createElement(C, { toast: d, position: h2 }));
  }));
};
var Vt = c;
export {
  _ as CheckmarkIcon,
  k as ErrorIcon,
  V as LoaderIcon,
  C as ToastBar,
  M as ToastIcon,
  Oe as Toaster,
  Vt as default,
  f as resolveValue,
  c as toast,
  O as useToaster,
  D as useToasterStore
};
//# sourceMappingURL=react-hot-toast.js.map

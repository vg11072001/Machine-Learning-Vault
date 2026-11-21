/* ==========================================================================
   Interactive SVG Simulators for Ridge & Lasso Regularization
   (All colors use CSS custom properties so light/dark mode adapts in CSS)
   ========================================================================== */
(function () {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";

  function el(tag, attrs, text) {
    const node = document.createElementNS(SVG_NS, tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        node.setAttribute(k, String(v));
      }
    }
    if (text !== undefined) {
      node.textContent = text;
    }
    return node;
  }

  /* ------------------------------------------------------------------------
     SIMULATOR 1: 2D Constraint Geometry (L2 Circle vs L1 Diamond vs Elastic Net)
     Solves min (b - b_ols)^T H (b - b_ols)  s.t.  alpha*|b|_1 + (1-alpha)*|b|_2^2 <= t
     via fine boundary search so intersection with contours is exact & smooth.
     ------------------------------------------------------------------------ */
  function initGeometrySim(root) {
    const svg = root.querySelector("svg");
    const budgetSlider = root.querySelector('[data-sim="budget"]');
    const corrSlider = root.querySelector('[data-sim="corr"]');
    const modeRadios = root.querySelectorAll('input[name="geom-mode"]');

    const budgetOut = root.querySelector('[data-out="budget"]');
    const corrOut = root.querySelector('[data-out="corr"]');
    const b1Out = root.querySelector('[data-out="b1"]');
    const b2Out = root.querySelector('[data-out="b2"]');
    const normOut = root.querySelector('[data-out="norm"]');
    const zeroOut = root.querySelector('[data-out="zero"]');
    const insightOut = root.querySelector('[data-out="insight"]');

    // Fixed OLS estimate in quadrant I, closer to beta2 axis so Lasso hits (0, t) easily
    const ols = { x: 0.72, y: 1.95 };

    // Map world [-2.6, 2.6] -> SVG [0, 320]
    const W = 320;
    const H = 320;
    const scale = 56;
    const cx = 150;
    const cy = 185;
    const toX = (x) => cx + x * scale;
    const toY = (y) => cy - y * scale;

    function getMode() {
      const checked = root.querySelector('input[name="geom-mode"]:checked');
      return checked ? checked.value : "lasso";
    }

    function penaltyVal(x, y, mode) {
      const l1 = Math.abs(x) + Math.abs(y);
      const l2 = Math.sqrt(x * x + y * y);
      if (mode === "ridge") return l2;
      if (mode === "lasso") return l1;
      // Elastic net contour: 0.5 * L1 + 0.5 * L2^2 (scaled for clean visual comparison)
      return 0.55 * l1 + 0.45 * (x * x + y * y);
    }

    function rssQuad(x, y, rho) {
      // H = [[1, rho], [rho, 1]] (standardized X^T X)
      const dx = x - ols.x;
      const dy = y - ols.y;
      return dx * dx + 2 * rho * dx * dy + dy * dy;
    }

    function radiusAtAngle(theta, t, mode) {
      const c = Math.abs(Math.cos(theta));
      const s = Math.abs(Math.sin(theta));
      if (mode === "ridge") return t;
      if (mode === "lasso") return t / (c + s);
      // Solve 0.45 r^2 + 0.55 (c+s) r - t = 0
      const a = 0.45;
      const b = 0.55 * (c + s);
      return (-b + Math.sqrt(b * b + 4 * a * t)) / (2 * a);
    }

    function solveConstrained(t, rho, mode) {
      if (penaltyVal(ols.x, ols.y, mode) <= t) {
        return { x: ols.x, y: ols.y, rss: 0 };
      }
      // Check boundary finely + exact axis corners
      let best = { x: 0, y: 0, rss: Infinity };
      const candidates = [];
      const N = 720;
      for (let i = 0; i < N; i++) {
        const th = (i / N) * Math.PI * 2;
        const r = radiusAtAngle(th, t, mode);
        candidates.push([r * Math.cos(th), r * Math.sin(th)]);
      }
      // Explicitly include the 4 exact axis corners
      for (const th of [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]) {
        const r = radiusAtAngle(th, t, mode);
        candidates.push([
          Math.abs(Math.cos(th)) < 1e-9 ? 0 : r * Math.cos(th),
          Math.abs(Math.sin(th)) < 1e-9 ? 0 : r * Math.sin(th),
        ]);
      }

      for (const [x, y] of candidates) {
        const val = rssQuad(x, y, rho);
        if (val < best.rss) {
          best = { x, y, rss: val };
        }
      }
      // Snap tiny numerical noise near 0 only if truly at a corner
      if (mode !== "ridge") {
        if (Math.abs(best.x) < 0.015) best.x = 0;
        if (Math.abs(best.y) < 0.015) best.y = 0;
      }
      return best;
    }

    function render() {
      const t = Number(budgetSlider.value);
      const rho = Number(corrSlider.value);
      const mode = getMode();

      budgetOut.textContent = t.toFixed(2);
      corrOut.textContent = rho.toFixed(2);

      const sol = solveConstrained(t, rho, mode);

      svg.replaceChildren();

      // Subtle grid lines
      for (let v = -2; v <= 3; v++) {
        svg.appendChild(
          el("line", {
            x1: 0,
            y1: toY(v),
            x2: W,
            y2: toY(v),
            stroke: "var(--border)",
            "stroke-width": v === 0 ? 1.5 : 0.6,
            "stroke-dasharray": v === 0 ? "" : "2 4",
          })
        );
        svg.appendChild(
          el("line", {
            x1: toX(v),
            y1: 0,
            x2: toX(v),
            y2: H,
            stroke: "var(--border)",
            "stroke-width": v === 0 ? 1.5 : 0.6,
            "stroke-dasharray": v === 0 ? "" : "2 4",
          })
        );
      }

      // Axis labels
      svg.appendChild(
        el(
          "text",
          { x: W - 26, y: cy - 6, fill: "var(--muted)", "font-size": 12, "font-family": "var(--font-serif)", "font-style": "italic" },
          "β₁"
        )
      );
      svg.appendChild(
        el(
          "text",
          { x: cx + 7, y: 16, fill: "var(--muted)", "font-size": 12, "font-family": "var(--font-serif)", "font-style": "italic" },
          "β₂"
        )
      );

      // Draw constraint region polygon
      const pts = [];
      const steps = 180;
      for (let i = 0; i < steps; i++) {
        const th = (i / steps) * Math.PI * 2;
        const r = radiusAtAngle(th, t, mode);
        pts.push(`${toX(r * Math.cos(th)).toFixed(1)},${toY(r * Math.sin(th)).toFixed(1)}`);
      }
      svg.appendChild(
        el("polygon", {
          points: pts.join(" "),
          fill: "var(--secondary-soft)",
          stroke: "var(--secondary)",
          "stroke-width": 2.2,
          "fill-opacity": 0.78,
        })
      );

      // Draw RSS contours centered at OLS
      // Eigenvalues of [[1, rho], [rho, 1]] are (1 + rho) along 45deg and (1 - rho) along -45deg
      const lam1 = Math.max(0.06, 1 + rho);
      const lam2 = Math.max(0.06, 1 - rho);
      const levels = sol.rss > 0.001
        ? [sol.rss * 0.2, sol.rss * 0.55, sol.rss, sol.rss * 1.6]
        : [0.08, 0.25, 0.55];

      levels.forEach((L, idx) => {
        const a = Math.sqrt(L / lam1) * scale; // semi-axis along +45 deg (world x=y)
        const b = Math.sqrt(L / lam2) * scale; // semi-axis along -45 deg
        const isTangent = sol.rss > 0.001 && idx === 2;
        // In SVG (y inverted), world +45deg is SVG -45deg
        svg.appendChild(
          el("ellipse", {
            cx: toX(ols.x),
            cy: toY(ols.y),
            rx: a.toFixed(1),
            ry: b.toFixed(1),
            transform: `rotate(-45 ${toX(ols.x).toFixed(1)} ${toY(ols.y).toFixed(1)})`,
            fill: "none",
            stroke: isTangent ? "var(--accent)" : "var(--muted)",
            "stroke-width": isTangent ? 2.2 : 1,
            "stroke-dasharray": isTangent ? "" : "4 3",
            opacity: isTangent ? 1 : 0.6,
          })
        );
      });

      // OLS point
      svg.appendChild(
        el("circle", {
          cx: toX(ols.x),
          cy: toY(ols.y),
          r: 4.5,
          fill: "var(--muted)",
        })
      );
      svg.appendChild(
        el(
          "text",
          {
            x: toX(ols.x) + 8,
            y: toY(ols.y) - 6,
            fill: "var(--text)",
            "font-size": 11,
            "font-family": "var(--font-sans)",
            "font-weight": 600,
          },
          "OLS β̂"
        )
      );

      // Constrained optimum point
      svg.appendChild(
        el("circle", {
          cx: toX(sol.x),
          cy: toY(sol.y),
          r: 6,
          fill: "var(--accent)",
          stroke: "var(--bg)",
          "stroke-width": 2,
        })
      );
      svg.appendChild(
        el(
          "text",
          {
            x: toX(sol.x) + 9,
            y: toY(sol.y) + 4,
            fill: "var(--accent)",
            "font-size": 11.5,
            "font-family": "var(--font-sans)",
            "font-weight": 700,
          },
          "β̂*"
        )
      );

      // Update readouts
      b1Out.textContent = sol.x.toFixed(3);
      b2Out.textContent = sol.y.toFixed(3);
      normOut.textContent =
        mode === "ridge"
          ? `L₂ = ${Math.hypot(sol.x, sol.y).toFixed(2)}`
          : mode === "lasso"
            ? `L₁ = ${(Math.abs(sol.x) + Math.abs(sol.y)).toFixed(2)}`
            : `EN = ${penaltyVal(sol.x, sol.y, mode).toFixed(2)}`;

      const isZero = sol.x === 0 || sol.y === 0;
      zeroOut.textContent = isZero ? "YES (exact zero!)" : "No (both non-zero)";

      if (sol.rss === 0) {
        insightOut.textContent =
          "Budget t is large enough to contain the OLS solution — regularization is inactive (λ = 0).";
      } else if (mode === "lasso" && isZero) {
        insightOut.textContent =
          "The expanding RSS ellipse hit the sharp corner on the β₂ axis first, forcing β₁ = 0 exactly. That is why L₁ performs automatic feature selection.";
      } else if (mode === "ridge") {
        insightOut.textContent =
          "Because the L₂ circle is smoothly curved everywhere with no axis corners, the ellipse tangent almost never lands on an axis — β₁ shrinks toward 0 without reaching 0.";
      } else if (mode === "elastic") {
        insightOut.textContent = isZero
          ? "Elastic Net keeps sharp axis corners (giving sparsity like Lasso) while curving its sides outward (stabilizing correlated features like Ridge)."
          : "Notice the curved edges of Elastic Net: with curved sides and high correlation, correlated features share weight smoothly, while corners still allow exact zeros at tighter budgets.";
      } else {
        insightOut.textContent =
          "At this correlation and budget, the ellipse touches a flat face of the diamond rather than a corner. Tighten the budget t slightly to watch β₁ snap to exact zero.";
      }
    }

    budgetSlider.addEventListener("input", render);
    corrSlider.addEventListener("input", render);
    modeRadios.forEach((r) => r.addEventListener("change", render));
    render();
  }

  /* ------------------------------------------------------------------------
     SIMULATOR 2: Ridge SVD / Eigenvalue & Condition Number Lab (Lesson 2)
     ------------------------------------------------------------------------ */
  function initRidgeSvdSim(root) {
    const svg = root.querySelector("svg");
    const corrSlider = root.querySelector('[data-sim="svd-corr"]');
    const lamSlider = root.querySelector('[data-sim="svd-lambda"]');

    const corrOut = root.querySelector('[data-out="svd-corr"]');
    const lamOut = root.querySelector('[data-out="svd-lambda"]');
    const kOlsOut = root.querySelector('[data-out="k-ols"]');
    const kRidgeOut = root.querySelector('[data-out="k-ridge"]');
    const s1Out = root.querySelector('[data-out="s1"]');
    const s2Out = root.querySelector('[data-out="s2"]');
    const dfOut = root.querySelector('[data-out="df"]');
    const insightOut = root.querySelector('[data-out="insight"]');

    function render() {
      const r = Number(corrSlider.value);
      const lam = Number(lamSlider.value);

      corrOut.textContent = r.toFixed(3);
      lamOut.textContent = lam.toFixed(2);

      // Standardized 2-feature Gram matrix X^T X = [[1, r], [r, 1]]
      // Eigenvalues (d_j^2) are 1 + r and 1 - r
      const d1sq = 1 + r;
      const d2sq = Math.max(0.002, 1 - r);

      const kOls = d1sq / d2sq;
      const kRidge = (d1sq + lam) / (d2sq + lam);
      const shrink1 = d1sq / (d1sq + lam);
      const shrink2 = d2sq / (d2sq + lam);
      const df = shrink1 + shrink2;

      kOlsOut.textContent = kOls > 500 ? `${kOls.toFixed(0)} (exploding!)` : kOls.toFixed(1);
      kRidgeOut.textContent = kRidge.toFixed(2);
      s1Out.textContent = `${(shrink1 * 100).toFixed(1)}% kept`;
      s2Out.textContent = `${(shrink2 * 100).toFixed(1)}% kept`;
      dfOut.textContent = `${df.toFixed(2)} / 2.00`;

      // Render simple crisp horizontal bar chart of shrinkage factors
      svg.replaceChildren();
      const W = 320;
      const H = 175;

      const bars = [
        {
          label: `Major PC (d₁² = ${d1sq.toFixed(2)})`,
          val: shrink1,
          y: 36,
          color: "var(--secondary)",
        },
        {
          label: `Minor PC (d₂² = ${d2sq.toFixed(3)})`,
          val: shrink2,
          y: 106,
          color: "var(--accent)",
        },
      ];

      bars.forEach((b) => {
        svg.appendChild(
          el(
            "text",
            {
              x: 16,
              y: b.y - 8,
              fill: "var(--text)",
              "font-size": 12,
              "font-family": "var(--font-sans)",
              "font-weight": 600,
            },
            b.label
          )
        );
        // Track
        svg.appendChild(
          el("rect", {
            x: 16,
            y: b.y,
            width: W - 82,
            height: 24,
            rx: 4,
            fill: "var(--surface)",
            stroke: "var(--border)",
          })
        );
        // Fill
        svg.appendChild(
          el("rect", {
            x: 16,
            y: b.y,
            width: Math.max(2, (W - 82) * b.val),
            height: 24,
            rx: 4,
            fill: b.color,
          })
        );
        // Pct text
        svg.appendChild(
          el(
            "text",
            {
              x: W - 56,
              y: b.y + 16,
              fill: "var(--text)",
              "font-size": 12,
              "font-family": "var(--font-mono)",
              "font-weight": 700,
            },
            `${(b.val * 100).toFixed(0)}%`
          )
        );
      });

      if (r >= 0.95 && lam > 0) {
        insightOut.textContent =
          "Notice the surgical precision of Ridge: along the noisy low-variance collinear direction (tiny d₂²), Ridge crushes the variance while keeping almost all signal along the high-variance direction (large d₁²).";
      } else if (lam === 0) {
        insightOut.textContent =
          "With λ = 0, this is pure OLS (df = 2.00). Push correlation r toward 0.99 to watch the OLS condition number explode.";
      } else {
        insightOut.textContent =
          "Adding λ shifts every eigenvalue from dⱼ² to dⱼ² + λ, bounding the condition number and reducing effective degrees of freedom smoothly.";
      }
    }

    corrSlider.addEventListener("input", render);
    lamSlider.addEventListener("input", render);
    render();
  }

  /* ------------------------------------------------------------------------
     SIMULATOR 3: Soft-Thresholding vs Ridge Shrinkage (Orthonormal Case)
     ------------------------------------------------------------------------ */
  function initSoftThresholdSim(root) {
    const svg = root.querySelector("svg");
    const lamSlider = root.querySelector('[data-sim="st-lambda"]');
    const zSlider = root.querySelector('[data-sim="st-z"]');

    const lamOut = root.querySelector('[data-out="st-lambda"]');
    const zOut = root.querySelector('[data-out="st-z"]');
    const ridgeOut = root.querySelector('[data-out="st-ridge"]');
    const lassoOut = root.querySelector('[data-out="st-lasso"]');
    const insightOut = root.querySelector('[data-out="insight"]');

    const W = 320;
    const H = 250;
    const cx = 160;
    const cy = 125;
    const sx = 36; // x in [-4, 4]
    const sy = 28; // y in [-4, 4]
    const toX = (x) => cx + x * sx;
    const toY = (y) => cy - y * sy;

    function softThresh(z, g) {
      if (z > g) return z - g;
      if (z < -g) return z + g;
      return 0;
    }

    function render() {
      const lam = Number(lamSlider.value);
      const z = Number(zSlider.value);
      const gamma = lam / 2;

      lamOut.textContent = lam.toFixed(2);
      zOut.textContent = z.toFixed(2);

      const bRidge = z / (1 + lam);
      const bLasso = softThresh(z, gamma);

      ridgeOut.textContent = bRidge.toFixed(3);
      lassoOut.textContent = bLasso.toFixed(3);

      svg.replaceChildren();

      // Axes
      svg.appendChild(el("line", { x1: 10, y1: cy, x2: W - 10, y2: cy, stroke: "var(--border)", "stroke-width": 1.4 }));
      svg.appendChild(el("line", { x1: cx, y1: 10, x2: cx, y2: H - 10, stroke: "var(--border)", "stroke-width": 1.4 }));

      // Dead-zone shading [-gamma, +gamma]
      if (gamma > 0.02) {
        svg.appendChild(
          el("rect", {
            x: toX(-Math.min(4, gamma)),
            y: 12,
            width: Math.min(8, 2 * gamma) * sx,
            height: H - 24,
            fill: "var(--accent-soft)",
            opacity: 0.7,
          })
        );
      }

      // OLS y = x dashed line
      svg.appendChild(
        el("line", {
          x1: toX(-3.8),
          y1: toY(-3.8),
          x2: toX(3.8),
          y2: toY(3.8),
          stroke: "var(--muted)",
          "stroke-dasharray": "4 4",
          "stroke-width": 1.2,
        })
      );

      // Ridge line y = x / (1 + lam)
      svg.appendChild(
        el("line", {
          x1: toX(-3.8),
          y1: toY(-3.8 / (1 + lam)),
          x2: toX(3.8),
          y2: toY(3.8 / (1 + lam)),
          stroke: "var(--secondary)",
          "stroke-width": 2.2,
        })
      );

      // Lasso piecewise soft-thresholding line
      const pts = [];
      for (let x = -3.8; x <= 3.81; x += 0.1) {
        pts.push(`${toX(x).toFixed(1)},${toY(softThresh(x, gamma)).toFixed(1)}`);
      }
      svg.appendChild(
        el("polyline", {
          points: pts.join(" "),
          fill: "none",
          stroke: "var(--accent)",
          "stroke-width": 2.6,
        })
      );

      // Vertical marker at current z
      svg.appendChild(
        el("line", {
          x1: toX(z),
          y1: 14,
          x2: toX(z),
          y2: H - 14,
          stroke: "var(--text)",
          "stroke-dasharray": "2 3",
          opacity: 0.45,
        })
      );
      svg.appendChild(el("circle", { cx: toX(z), cy: toY(bRidge), r: 5, fill: "var(--secondary)" }));
      svg.appendChild(el("circle", { cx: toX(z), cy: toY(bLasso), r: 5, fill: "var(--accent)" }));

      // Legend
      svg.appendChild(el("text", { x: 14, y: 24, fill: "var(--muted)", "font-size": 10.5, "font-family": "var(--font-sans)" }, "--- OLS (slope 1)"));
      svg.appendChild(el("text", { x: 14, y: 39, fill: "var(--secondary)", "font-size": 10.5, "font-family": "var(--font-sans)", "font-weight": 700 }, "— Ridge: z / (1 + λ)"));
      svg.appendChild(el("text", { x: 14, y: 54, fill: "var(--accent)", "font-size": 10.5, "font-family": "var(--font-sans)", "font-weight": 700 }, "— Lasso: S(z, λ/2)"));

      if (Math.abs(z) <= gamma) {
        insightOut.textContent =
          `Because |β̂_OLS| = ${Math.abs(z).toFixed(2)} ≤ λ/2 = ${gamma.toFixed(2)}, Lasso snaps the coefficient to EXACT ZERO inside the shaded dead-zone, while Ridge keeps ${bRidge.toFixed(3)}.`;
      } else {
        insightOut.textContent =
          `Outside the dead-zone, Lasso shifts β̂_OLS toward zero by a CONSTANT amount λ/2 = ${gamma.toFixed(2)}, whereas Ridge shrinks PROPORTIONALLY by 1/(1+λ) — hurting huge true signals more at large |z|!`;
      }
    }

    lamSlider.addEventListener("input", render);
    zSlider.addEventListener("input", render);
    render();
  }

  /* ------------------------------------------------------------------------
     SIMULATOR 4: Bayesian Priors — Gaussian (Ridge) vs Laplace (Lasso)
     ------------------------------------------------------------------------ */
  function initPriorSim(root) {
    const svg = root.querySelector("svg");
    const scaleSlider = root.querySelector('[data-sim="prior-scale"]');
    const scaleOut = root.querySelector('[data-out="prior-scale"]');
    const insightOut = root.querySelector('[data-out="insight"]');

    const W = 320;
    const H = 200;
    const cx = 160;
    const baseY = 172;
    const sx = 34; // beta in [-4.2, 4.2]
    const sy = 190;

    function render() {
      const s = Number(scaleSlider.value); // std dev matched for fair comparison
      scaleOut.textContent = s.toFixed(2);

      const tau = s;
      const bLap = s / Math.SQRT2; // variance of Laplace(0, b) is 2*b^2 = s^2

      svg.replaceChildren();
      svg.appendChild(el("line", { x1: 12, y1: baseY, x2: W - 12, y2: baseY, stroke: "var(--border)", "stroke-width": 1.3 }));
      svg.appendChild(el("line", { x1: cx, y1: 14, x2: cx, y2: baseY, stroke: "var(--border)", "stroke-dasharray": "3 3" }));

      const gaussPts = [];
      const lapPts = [];
      for (let x = -4.2; x <= 4.21; x += 0.08) {
        const g = (1 / (tau * Math.sqrt(2 * Math.PI))) * Math.exp(-(x * x) / (2 * tau * tau));
        const l = (1 / (2 * bLap)) * Math.exp(-Math.abs(x) / bLap);
        gaussPts.push(`${(cx + x * sx).toFixed(1)},${Math.max(14, baseY - g * sy).toFixed(1)}`);
        lapPts.push(`${(cx + x * sx).toFixed(1)},${Math.max(14, baseY - l * sy).toFixed(1)}`);
      }

      svg.appendChild(
        el("polyline", {
          points: gaussPts.join(" "),
          fill: "none",
          stroke: "var(--secondary)",
          "stroke-width": 2.4,
        })
      );
      svg.appendChild(
        el("polyline", {
          points: lapPts.join(" "),
          fill: "none",
          stroke: "var(--accent)",
          "stroke-width": 2.4,
        })
      );

      svg.appendChild(el("text", { x: 14, y: 26, fill: "var(--secondary)", "font-size": 11, "font-family": "var(--font-sans)", "font-weight": 700 }, "— Gaussian Prior (Ridge / L₂)"));
      svg.appendChild(el("text", { x: 14, y: 42, fill: "var(--accent)", "font-size": 11, "font-family": "var(--font-sans)", "font-weight": 700 }, "— Laplace Prior (Lasso / L₁)"));
      svg.appendChild(el("text", { x: cx + 6, y: baseY + 15, fill: "var(--muted)", "font-size": 11, "font-family": "var(--font-serif)", "font-style": "italic" }, "β = 0"));

      insightOut.textContent =
        "With equal variance, the Laplace prior puts a sharp, non-differentiable spike at β = 0 (pulling weak weights to exact 0) AND heavier tails (tolerating occasional huge true signals better than Gaussian). Tighter prior scale = larger λ.";
    }

    scaleSlider.addEventListener("input", render);
    render();
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('[data-simulator="geometry"]').forEach(initGeometrySim);
    document.querySelectorAll('[data-simulator="ridge-svd"]').forEach(initRidgeSvdSim);
    document.querySelectorAll('[data-simulator="soft-threshold"]').forEach(initSoftThresholdSim);
    document.querySelectorAll('[data-simulator="bayesian-prior"]').forEach(initPriorSim);
  });
})();

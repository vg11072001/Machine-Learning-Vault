# Ridge & Lasso Regularization — Interactive Course (Basic to Advanced)

> **Open Interactive HTML Course Directly:**
> - **Instant Live Preview (works immediately):** [Launch Ridge & Lasso Course](https://raw.githack.com/vg11072001/Machine-Learning-Vault/main/ml%20notes/Theory/Concepts/ridge-lasso/index.html)
> - **GitHub Pages URL** *(once enabled under Repo Settings → Pages → Branch: `main`, Folder: `/ (root)`)*: [https://vg11072001.github.io/Machine-Learning-Vault/ml%20notes/Theory/Concepts/ridge-lasso/](https://vg11072001.github.io/Machine-Learning-Vault/ml%20notes/Theory/Concepts/ridge-lasso/)
> - **Local:** Open [`index.html`](./index.html) directly in your browser.

---

## Lessons & Direct Links

| # | Lesson | Topics Covered | Live Preview |
| :-: | :--- | :--- | :--- |
| 01 | **Why OLS Breaks & Regularization Basics** | Overfitting, multicollinearity, singular $X^TX$, bias–variance tradeoff, why to standardize, why $\beta_0$ is unpenalized | [Open Lesson 01](https://raw.githack.com/vg11072001/Machine-Learning-Vault/main/ml%20notes/Theory/Concepts/ridge-lasso/lessons/0001-why-ols-breaks-and-regularization-basics.html) |
| 02 | **Ridge ($L_2$): Math, Closed Form & SVD** | Matrix calculus derivation, eigenvalue shift, condition number lab, SVD shrinkage, effective $df(\lambda)$, Woodbury dual trick | [Open Lesson 02](https://raw.githack.com/vg11072001/Machine-Learning-Vault/main/ml%20notes/Theory/Concepts/ridge-lasso/lessons/0002-ridge-regression-l2-math-svd-and-why.html) |
| 03 | **Lasso ($L_1$): Geometry, Soft-Thresholding & Solvers** | Interactive $L_1$ diamond vs. $L_2$ circle lab, subgradients & soft-thresholding, Coordinate Descent / ISTA / LARS, $p>n$ & correlation limits | [Open Lesson 03](https://raw.githack.com/vg11072001/Machine-Learning-Vault/main/ml%20notes/Theory/Concepts/ridge-lasso/lessons/0003-lasso-regression-l1-geometry-sparsity-and-solvers.html) |
| 04 | **Advanced: Bayesian MAP, Elastic Net, CV & Traps** | Gaussian vs. Laplace priors, Elastic Net grouping & augmented proof, CV & 1-SE rule, `Pipeline` leakage trap, post-selection inference, AdamW | [Open Lesson 04](https://raw.githack.com/vg11072001/Machine-Learning-Vault/main/ml%20notes/Theory/Concepts/ridge-lasso/lessons/0004-advanced-bayesian-elastic-net-cv-and-gotchas.html) |
| 05 | **Interleaved Interview Drills & Whiteboard Lab** | 6 mixed-topic rapid-fire MCQs + 5 senior whiteboard / code-review scenarios with self-graded rubrics | [Open Lesson 05](https://raw.githack.com/vg11072001/Machine-Learning-Vault/main/ml%20notes/Theory/Concepts/ridge-lasso/lessons/0005-interview-drills-and-whiteboard-scenarios.html) |

## Printable Reference Sheets

- **Canonical Glossary:** [Open Glossary](https://raw.githack.com/vg11072001/Machine-Learning-Vault/main/ml%20notes/Theory/Concepts/ridge-lasso/reference/glossary.html) ([`reference/glossary.html`](./reference/glossary.html))
- **Interview Cheat Sheet:** [Open Cheat Sheet](https://raw.githack.com/vg11072001/Machine-Learning-Vault/main/ml%20notes/Theory/Concepts/ridge-lasso/reference/interview-cheatsheet.html) ([`reference/interview-cheatsheet.html`](./reference/interview-cheatsheet.html))

## Folder Organization

```text
ridge-lasso/
├── README.md                 ← You are here (direct live links)
├── index.html                ← Interactive course hub & roadmap
├── MISSION.md                ← Learning goals & interview mastery criteria
├── RESOURCES.md              ← Verified primary papers, textbooks & communities
├── NOTES.md                  ← Study notes & preferences
├── assets/                   ← Shared stylesheet, quiz engine & SVG simulators
├── lessons/                  ← 0001–0005 step-by-step interactive HTML lessons
└── reference/                ← Printable glossary & interview cheat sheet
```

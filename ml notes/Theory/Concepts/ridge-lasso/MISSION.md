# Mission: Ridge & Lasso Regularization for ML Interviews

## Why
Master Ridge ($L_2$) and Lasso ($L_1$) regularization from first principles through advanced theory and production traps so you can derive every step on a whiteboard, explain the *how* and *why* under follow-up questioning, and pass Machine Learning / Data Science technical interviews with confidence.

## Success looks like
- Derive the closed-form Ridge estimator $(X^T X + \lambda I)^{-1} X^T y$ from scratch and explain why $+\lambda I$ fixes singular or ill-conditioned $X^T X$ using eigenvalues and SVD.
- Prove geometrically (constraint regions) and algebraically (subgradients / soft-thresholding) why Lasso produces exact zeros while Ridge shrinks coefficients asymptotically toward zero.
- Explain every preprocessing and evaluation step and *why* it matters: feature standardization, excluding the intercept $\beta_0$, preventing data leakage during cross-validation, and applying the 1-SE rule.
- Connect regularization to adjacent advanced topics interviewers probe: Bayesian MAP priors (Gaussian vs. Laplace), Elastic Net grouping & $p > n$, Coordinate Descent / LARS, post-selection inference, and $L_2$ weight decay in deep learning.
- Complete interleaved interview drills cleanly from memory without hints.

## Constraints
- Progression must run from basic intuition to advanced mathematical and engineering nuances.
- Every step must explicitly explain both **how** it works and **why** it is done that way.
- Delivered as clean, self-contained HTML lessons and printable reference docs organized in `ridge-lasso/`.
- Calibrate depth and pacing after Lesson 1 once prior math/ML background and target interview level are confirmed.

## Out of scope
- Non-linear kernel methods (Kernel Ridge Regression theory beyond a brief mention) and deep learning optimizer proofs beyond the $L_2$ / decoupled weight decay (AdamW) link.
- Implementing production Cython/Fortran linear algebra solvers from scratch.

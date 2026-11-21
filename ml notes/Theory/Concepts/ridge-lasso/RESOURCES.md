# Ridge & Lasso Regularization Resources

## Knowledge

- [Book: *An Introduction to Statistical Learning (ISLR, 2nd ed. / Python & R)* by James, Witten, Hastie, & Tibshirani](https://www.statlearning.com/)
  Free official textbook from the creators of Lasso/Elastic Net. Use for: **Chapter 6 (Linear Model Selection and Regularization)** — crystal-clear geometric intuition, bias-variance tradeoff, standardization, and cross-validation.
- [Book: *The Elements of Statistical Learning (ESL, 2nd ed.)* by Hastie, Tibshirani, & Friedman](https://web.stanford.edu/~hastie/ElemStatLearn/)
  Free official graduate-level reference. Use for: **Chapter 3 (Sections 3.4.1 Ridge, 3.4.2 Lasso, 3.4.4 LARS, 3.8 Elastic Net)** — SVD shrinkage derivation, effective degrees of freedom, Bayesian interpretation, and path algorithms.
- [Paper: "Ridge Regression: Biased Estimation for Nonorthogonal Problems" by Hoerl & Kennard (1970, *Technometrics* 12(1), 55–67)](https://doi.org/10.1080/00401706.1970.10488634)
  The foundational Ridge paper introducing the ridge trace and proving that a small $\lambda > 0$ strictly reduces MSE over OLS when predictors are collinear. Use for: historical motivation and variance-explosion mechanics.
- [Paper: "Regression Shrinkage and Selection via the Lasso" by Robert Tibshirani (1996, *JRSS-B* 58(1), 267–288)](https://doi.org/10.1111/j.2517-6161.1996.tb02080.x)
  The original Lasso paper establishing $L_1$ sparsity, constraint geometry, soft-thresholding in the orthonormal case, and Laplace MAP equivalence. Use for: exact theoretical foundations of Lasso.
- [Paper: "Regularization and Variable Selection via the Elastic Net" by Zou & Hastie (2005, *JRSS-B* 67(2), 301–320)](https://doi.org/10.1111/j.1467-9868.2005.00503.x)
  Introduces Elastic Net to fix Lasso's two famous failure modes ($p > n$ saturation and arbitrary selection among correlated variables). Use for: grouping effect theorem and naive vs. rescaled Elastic Net.
- [Paper: "Regularization Paths for Generalized Linear Models via Coordinate Descent" by Friedman, Hastie, & Tibshirani (2010, *JSS* 33(1), 1–22)](https://doi.org/10.18637/jss.v033.i01)
  Explains why cyclical coordinate descent with warm starts and active-set cycling (`glmnet`) is the practical solver of choice for Lasso and Elastic Net. Use for: optimization mechanics and computational complexity.
- [Documentation: *scikit-learn 1.1. Linear Models User Guide* (Sections 1.1.2 Ridge, 1.1.3 Lasso, 1.1.5 Elastic-Net)](https://scikit-learn.org/stable/modules/linear_model.html)
  Authoritative engineering reference for exact objective scaling (`1 / (2 * n_samples)`), solver options (`cholesky`, `svd`, `saga`, coordinate descent), `RidgeCV`, `LassoCV`, and `Pipeline` usage. Use for: production and coding interview accuracy.

## Wisdom (Communities)

- [Cross Validated (stats.stackexchange.com)](https://stats.stackexchange.com/questions/tagged/regularization)
  Highest-signal statistics Q&A community on the web, frequented by practicing statisticians and professors. Use for: canonical edge-case debates ("When does Ridge beat Lasso?", "Why not penalize the intercept?", "Why can't you compare Ridge and Lasso $\lambda$ values directly?").
- [r/MachineLearning & r/datascience](https://www.reddit.com/r/MachineLearning/)
  Practitioner communities for seeing how regularization questions actually surface in ML interviews and tabular modeling workflows. Use for: calibrating interview expectations and real-world modeling trade-offs.

## Gaps

- Interactive Bayesian posterior vs. MAP visualization for Gaussian/Laplace priors (covered inline in Lesson 4; can expand into a dedicated deep-dive lesson if the learner targets research-heavy ML interviews).
- Selective inference / post-Lasso confidence intervals (Lee et al., 2016) — introduced conceptually in Lesson 4; add primary paper if learner targets Senior Statistician / Causal Inference roles.

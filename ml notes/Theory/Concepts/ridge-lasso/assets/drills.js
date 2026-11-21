/* ==========================================================================
   Reusable Retrieval Quiz, Interview Self-Rating & Range Fallback Engine
   ========================================================================== */
(function () {
  "use strict";

  const STORAGE_KEY = "ridge-lasso-progress-v1";

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function saveProgress(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* Ignore storage quota or private browsing restrictions */
    }
  }

  /* 1. Brand-consistent range slider fallback when accent-color is unsupported */
  function initRangeFallback() {
    if (typeof CSS !== "undefined" && CSS.supports("accent-color", "red")) {
      return;
    }
    document.querySelectorAll('input[type="range"]').forEach((slider) => {
      const update = () => {
        const min = Number(slider.min || 0);
        const max = Number(slider.max || 100);
        const val = Number(slider.value || 0);
        const pct = max === min ? 0 : ((val - min) / (max - min)) * 100;
        slider.style.setProperty("--progress", `${pct}%`);
      };
      update();
      slider.addEventListener("input", update);
    });
  }

  /* 2. Multiple-Choice Retrieval Quiz Engine */
  function initQuizzes() {
    const containers = document.querySelectorAll("[data-quiz-group]");
    if (!containers.length) return;

    containers.forEach((group) => {
      const groupId = group.getAttribute("data-quiz-group");
      const cards = Array.from(group.querySelectorAll(".quiz-card"));
      const scoreOut = group.querySelector("[data-quiz-score]");
      const resetBtn = group.querySelector("[data-quiz-reset]");

      let answered = new Map();

      function updateScore() {
        let correctCount = 0;
        answered.forEach((isOk) => {
          if (isOk) correctCount += 1;
        });
        if (scoreOut) {
          scoreOut.textContent = `Score: ${correctCount} / ${cards.length} answered (${answered.size}/${cards.length})`;
        }
        const progress = loadProgress();
        progress[groupId] = {
          correct: correctCount,
          total: cards.length,
          completed: answered.size === cards.length,
        };
        saveProgress(progress);
      }

      cards.forEach((card, qIdx) => {
        const correctIdx = Number(card.getAttribute("data-answer"));
        const buttons = Array.from(card.querySelectorAll(".quiz-option"));
        const feedback = card.querySelector(".quiz-feedback");
        const explainText = card.getAttribute("data-explain") || "";

        buttons.forEach((btn, optIdx) => {
          btn.addEventListener("click", () => {
            if (answered.has(qIdx)) return;

            const isRight = optIdx === correctIdx;
            answered.set(qIdx, isRight);

            buttons.forEach((b, idx) => {
              b.disabled = true;
              if (idx === correctIdx) {
                b.classList.add("is-correct");
              } else if (idx === optIdx && !isRight) {
                b.classList.add("is-wrong");
              }
            });

            if (feedback) {
              feedback.className = `quiz-feedback show ${isRight ? "ok" : "bad"}`;
              feedback.textContent =
                (isRight ? "Correct. " : "Not quite. ") + explainText;
            }
            updateScore();
          });
        });
      });

      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          answered.clear();
          cards.forEach((card) => {
            card.querySelectorAll(".quiz-option").forEach((b) => {
              b.disabled = false;
              b.classList.remove("is-correct", "is-wrong");
            });
            const fb = card.querySelector(".quiz-feedback");
            if (fb) {
              fb.className = "quiz-feedback";
              fb.textContent = "";
            }
          });
          updateScore();
        });
      }

      updateScore();
    });
  }

  /* 3. Interview Whiteboard Self-Rating */
  function initWhiteboardDrills() {
    const progress = loadProgress();
    document.querySelectorAll("[data-drill-id]").forEach((drill) => {
      const id = drill.getAttribute("data-drill-id");
      const goodBtn = drill.querySelector('[data-rate="good"]');
      const reviewBtn = drill.querySelector('[data-rate="review"]');
      const statusOut = drill.querySelector("[data-rate-status]");

      function render(state) {
        if (!goodBtn || !reviewBtn) return;
        goodBtn.classList.toggle("active-good", state === "good");
        reviewBtn.classList.toggle("active-review", state === "review");
        if (statusOut) {
          statusOut.textContent =
            state === "good"
              ? "Marked: Ready for interview"
              : state === "review"
                ? "Marked: Revisit in spaced review"
                : "";
        }
      }

      if (progress[id]) {
        render(progress[id]);
      }

      if (goodBtn) {
        goodBtn.addEventListener("click", () => {
          const p = loadProgress();
          p[id] = "good";
          saveProgress(p);
          render("good");
        });
      }
      if (reviewBtn) {
        reviewBtn.addEventListener("click", () => {
          const p = loadProgress();
          p[id] = "review";
          saveProgress(p);
          render("review");
        });
      }
    });
  }

  /* 4. Course Hub Progress Badges */
  function initHubBadges() {
    const progress = loadProgress();
    document.querySelectorAll("[data-hub-badge]").forEach((el) => {
      const key = el.getAttribute("data-hub-badge");
      const entry = progress[key];
      if (!entry) return;
      el.textContent = `${entry.correct}/${entry.total} quiz`;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initRangeFallback();
    initQuizzes();
    initWhiteboardDrills();
    initHubBadges();
  });
})();

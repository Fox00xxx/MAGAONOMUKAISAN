/* 真顔の向井さん Official Website
   機能ごとに分け、将来のコンテンツ追加をしやすくしています。 */
document.addEventListener("DOMContentLoaded", () => {
  // トップ映像：自動再生を許可しない環境でも、背景グラフィックを残して表示を維持します。
  const heroVideo = document.querySelector(".hero__video");
  if (heroVideo) {
    try {
      const playback = heroVideo.play();
      if (playback && typeof playback.catch === "function") {
        playback.catch(() => heroVideo.classList.add("is-paused"));
      }
    } catch (error) {
      heroVideo.classList.add("is-paused");
    }
    heroVideo.addEventListener("error", () => heroVideo.classList.add("is-unavailable"));
  }

  const menuButton = document.querySelector(".menu-button");
  const navigation = document.querySelector(".global-nav");

  // モバイル用ハンバーガーメニュー
  if (menuButton && navigation) {
    const closeMenu = () => {
      menuButton.classList.remove("is-open");
      navigation.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "メニューを開く");
    };
    menuButton.addEventListener("click", () => {
      const willOpen = !menuButton.classList.contains("is-open");
      menuButton.classList.toggle("is-open", willOpen);
      navigation.classList.toggle("is-open", willOpen);
      menuButton.setAttribute("aria-expanded", String(willOpen));
      menuButton.setAttribute("aria-label", willOpen ? "メニューを閉じる" : "メニューを開く");
    });
    navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      // 表示中のモバイルメニューだけを閉じる（PC表示のリンクには影響させません）。
      if (window.matchMedia("(max-width: 720px)").matches) closeMenu();
    }));
  }

  // スクロール時に要素を滑らかに表示
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    // 古いブラウザでは、非表示のままにならないよう全要素を表示します。
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // WORKS 年表のアコーディオン
  document.querySelectorAll(".timeline__trigger").forEach((trigger) => {
    const initialPanel = trigger.closest(".timeline__item").querySelector(".timeline__panel");
    // hidden属性を外し、CSSトランジションで閉じた状態を表現します。
    initialPanel.hidden = false;
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".timeline__item");
      const isOpen = item.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", String(isOpen));
    });
  });

  // お問い合わせフォームは FormSubmit を通じて非同期送信し、ページ遷移せず完了メッセージを表示します。
  const form = document.querySelector(".contact-form");
  if (form) {
    const status = form.querySelector(".form-status");
    const submitButton = form.querySelector(".submit-button");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      status.textContent = "送信中です…";
      status.className = "form-status is-sending";
      submitButton.disabled = true;

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error("送信に失敗しました。");
        form.reset();
        status.textContent = "送信されました。お問い合わせありがとうございます。";
        status.className = "form-status is-success";
      } catch (error) {
        status.textContent = "送信できませんでした。時間をおいて、もう一度お試しください。";
        status.className = "form-status is-error";
      } finally {
        submitButton.disabled = false;
      }
    });
  }
});

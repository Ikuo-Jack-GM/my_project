/**
 * 瞬カー - メインJavaScript
 * フォームバリデーション、スクロールアニメーション、その他のインタラクション
 */

// DOMが完全に読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function() {

    // ========== フォームバリデーション ==========
    const form = document.getElementById('contact-form');
    const thankYouMessage = document.getElementById('thank-you-message');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // エラーメッセージをクリア
            clearErrors();

            // バリデーション
            let isValid = true;

            // 会社名のバリデーション
            const company = document.getElementById('company');
            if (!company.value.trim()) {
                showError(company, '会社名を入力してください');
                isValid = false;
            }

            // お名前のバリデーション
            const name = document.getElementById('name');
            if (!name.value.trim()) {
                showError(name, 'お名前を入力してください');
                isValid = false;
            }

            // メールアドレスのバリデーション
            const email = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim()) {
                showError(email, 'メールアドレスを入力してください');
                isValid = false;
            } else if (!emailRegex.test(email.value)) {
                showError(email, '有効なメールアドレスを入力してください');
                isValid = false;
            }

            // プライバシーポリシー同意のバリデーション
            const privacyConsent = document.getElementById('privacy-consent');
            const privacyError = document.getElementById('privacy-error');
            if (!privacyConsent.checked) {
                privacyError.textContent = 'プライバシーポリシーへの同意が必要です';
                privacyError.classList.remove('hidden');
                isValid = false;
            }

            // バリデーションが成功した場合
            if (isValid) {
                // フォームデータを収集（実際の送信処理はバックエンドで実装）
                const formData = new FormData(form);

                // ローディング状態を表示
                const submitButton = form.querySelector('button[type="submit"]');
                submitButton.classList.add('loading');
                submitButton.disabled = true;

                // シミュレーション：実際はバックエンドにデータを送信
                setTimeout(() => {
                    // フォームを非表示にして、Thank Youメッセージを表示
                    form.classList.add('hidden');
                    thankYouMessage.classList.remove('hidden');

                    // ページトップにスクロール
                    thankYouMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // 実際の実装では、以下のようなコードでバックエンドに送信
                    // fetch('/api/contact', {
                    //     method: 'POST',
                    //     body: formData
                    // })
                    // .then(response => response.json())
                    // .then(data => {
                    //     form.classList.add('hidden');
                    //     thankYouMessage.classList.remove('hidden');
                    // })
                    // .catch(error => {
                    //     console.error('Error:', error);
                    //     alert('送信中にエラーが発生しました。もう一度お試しください。');
                    //     submitButton.classList.remove('loading');
                    //     submitButton.disabled = false;
                    // });
                }, 1000);
            }
        });
    }

    // エラーメッセージを表示する関数
    function showError(input, message) {
        input.classList.add('error');
        const errorSpan = input.nextElementSibling;
        if (errorSpan && errorSpan.classList.contains('error-message')) {
            errorSpan.textContent = message;
            errorSpan.classList.remove('hidden');
        }
    }

    // すべてのエラーメッセージをクリアする関数
    function clearErrors() {
        const errorInputs = document.querySelectorAll('.error');
        errorInputs.forEach(input => input.classList.remove('error'));

        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(message => {
            message.textContent = '';
            message.classList.add('hidden');
        });
    }

    // ========== スムーズスクロール ==========
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // 空のハッシュリンクは無視
            if (href === '#') {
                return;
            }

            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // URLを更新（履歴に追加せずに）
                history.pushState(null, null, href);
            }
        });
    });

    // ========== スクロールアニメーション ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // アニメーション対象の要素を監視
    const animateElements = document.querySelectorAll('.scroll-fade-in');
    animateElements.forEach(element => {
        observer.observe(element);
    });

    // ========== モバイルメニュー（必要に応じて実装） ==========
    // 現在のデザインにはナビゲーションメニューがないため、
    // 将来的に追加する場合はここに実装

    // ========== フォーム入力時のエラークリア ==========
    const formInputs = form?.querySelectorAll('input, textarea, select');
    formInputs?.forEach(input => {
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                const errorSpan = this.nextElementSibling;
                if (errorSpan && errorSpan.classList.contains('error-message')) {
                    errorSpan.classList.add('hidden');
                }
            }
        });

        // チェックボックスの場合
        if (input.type === 'checkbox') {
            input.addEventListener('change', function() {
                const privacyError = document.getElementById('privacy-error');
                if (this.checked && privacyError) {
                    privacyError.classList.add('hidden');
                }
            });
        }
    });

    // ========== 数値カウントアップアニメーション（オプション） ==========
    function animateValue(element, start, end, duration, suffix = '') {
        const range = end - start;
        const increment = range / (duration / 16); // 60fps
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 16);
    }

    // ========== ページ読み込み時の初期化 ==========
    // ページトップにスクロール（オプション）
    if (window.location.hash) {
        setTimeout(() => {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }

    // ========== アクセシビリティ：Escapeキーでモーダルやオーバーレイを閉じる ==========
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // 将来的にモーダルウィンドウを追加する場合の処理
            // 例: モーダルを閉じる処理
        }
    });

    // ========== パフォーマンス：画像の遅延読み込み ==========
    if ('loading' in HTMLImageElement.prototype) {
        // ブラウザがネイティブの遅延読み込みをサポートしている場合
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // フォールバック：Intersection Observerを使用
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ========== Google Analytics（実装例） ==========
    // 実際の実装では、Google Analytics のトラッキングコードを追加
    // window.dataLayer = window.dataLayer || [];
    // function gtag(){dataLayer.push(arguments);}
    // gtag('js', new Date());
    // gtag('config', 'GA_MEASUREMENT_ID');

    // ========== コンソールメッセージ ==========
    console.log('瞬カー - ランディングページが正常に読み込まれました');
});

// ========== ユーティリティ関数 ==========

/**
 * スクロール位置を取得
 */
function getScrollPosition() {
    return window.pageYOffset || document.documentElement.scrollTop;
}

/**
 * 要素が画面内に表示されているかチェック
 */
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * デバウンス関数（パフォーマンス最適化用）
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========== スクロールイベント（パフォーマンス最適化） ==========
let ticking = false;
window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(function() {
            // スクロールに応じた処理をここに追加
            // 例: ヘッダーの背景変更、スクロールトップボタンの表示/非表示など

            ticking = false;
        });
        ticking = true;
    }
});

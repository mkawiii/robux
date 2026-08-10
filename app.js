/* ==========================================================================
   OFFICIAL ROBLOX REWARDS HUB - ADBLUEMEDIA OFFER COMPLETION & PIN REVEAL ENGINE
   ========================================================================== */

let generatedPinCode = '';

function randomPinChunk() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function revealUnlockedPinCode() {
  const processModal = document.getElementById('process-modal');
  const pageUnlockedPinCard = document.getElementById('page-unlocked-pin-card');
  const pagePinCodeText = document.getElementById('page-pin-code-text');

  // Generate verified 16-digit Robux PIN code
  generatedPinCode = `RBLX-${randomPinChunk()}-${randomPinChunk()}-${randomPinChunk()}`;
  if (pagePinCodeText) pagePinCodeText.textContent = generatedPinCode;

  // Close content locker modal
  if (processModal) processModal.classList.remove('active');

  // Open Full-Screen Blurry Backdrop Spotlight Modal focused 100% on the reward!
  if (pageUnlockedPinCard) {
    pageUnlockedPinCard.style.display = 'flex';
  }
}

// Attach global callbacks for AdBlueMedia & CPABuild postback completion
window.CPABuildComplete = revealUnlockedPinCode;
window.AdBlueMediaComplete = revealUnlockedPinCode;
window.onLockerComplete = revealUnlockedPinCode;
window.unlockCode = revealUnlockedPinCode;
window.offerCompleted = revealUnlockedPinCode;

function triggerAdBlueMediaLocker() {
  // Execute AdBlueMedia's native locker trigger function directly
  if (typeof window._Yv === 'function') {
    try { window._Yv(); return; } catch (e) { console.log('AdBlueMedia _Yv error:', e); }
  }
  if (typeof window._call === 'function') {
    try { window._call(); return; } catch (e) {}
  }
  if (typeof window._cl === 'function') {
    try { window._cl(); return; } catch (e) {}
  }
  if (typeof window.SqTvJ_cOn_SOAANc === 'function') {
    try { window.SqTvJ_cOn_SOAANc(); return; } catch (e) {}
  }
}

document.addEventListener('DOMContentLoaded', () => {

  // --- LIGHT / DARK THEME TOGGLE ENGINE ---
  const btnThemeToggle = document.getElementById('btn-theme-toggle');
  const themeToggleIcon = document.getElementById('theme-toggle-icon');

  const savedTheme = localStorage.getItem('rblx_theme') || 'dark';
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeToggleIcon) themeToggleIcon.className = 'fa-solid fa-sun';
  }

  if (btnThemeToggle) {
    btnThemeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      if (currentTheme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('rblx_theme', 'dark');
        if (themeToggleIcon) themeToggleIcon.className = 'fa-solid fa-moon';
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('rblx_theme', 'light');
        if (themeToggleIcon) themeToggleIcon.className = 'fa-solid fa-sun';
      }
    });
  }

  // --- BACKGROUND CANVAS PARTICLES ---
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 1.5;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.speedY = - (Math.random() * 0.8 + 0.2);
        this.color = Math.random() > 0.4 ? 'rgba(0, 162, 255, ' : 'rgba(255, 184, 0, ';
        this.opacity = Math.random() * 0.5 + 0.15;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        if (this.y < -20 || this.x < -20 || this.x > canvas.width + 20) {
          this.reset();
          this.y = canvas.height + 10;
        }
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color + this.opacity + ')';
        const s = this.size * 2;
        ctx.beginPath();
        ctx.rect(-s/2, -s/2, s, s);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < 45; i++) {
      particles.push(new Particle());
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateCanvas);
    }
    animateCanvas();
  }

  // --- AUDIO SYNTHESIZER MODULE ---
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function playUiSound(type) {
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') { audioCtx.resume(); }
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.06);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'success') {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const noteOsc = audioCtx.createOscillator();
        const noteGain = audioCtx.createGain();
        noteOsc.type = 'triangle';
        noteOsc.frequency.setValueAtTime(freq, now + idx * 0.08);
        noteGain.gain.setValueAtTime(0.15, now + idx * 0.08);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
        noteOsc.connect(noteGain);
        noteGain.connect(audioCtx.destination);
        noteOsc.start(now + idx * 0.08);
        noteOsc.stop(now + idx * 0.08 + 0.25);
      });
    }
  }

  // --- STEP 1: PROFILE SYNC & AVATAR LOOKUP ---
  const usernameInput = document.getElementById('rblx-username-input');
  const btnSync = document.getElementById('btn-sync-profile');
  const syncIcon = document.getElementById('sync-icon');
  const syncText = document.getElementById('sync-text');
  
  const displayUsername = document.getElementById('display-username');
  const displayUserId = document.getElementById('display-userid');
  const avatarImgHeadshot = document.getElementById('avatar-img-headshot');
  const syncStatusBadge = document.getElementById('sync-status-badge');
  const syncNextPrompt = document.getElementById('sync-next-prompt');

  let syncedUser = 'Guest Player';
  let selectedRobuxAmount = 800;

  if (btnSync) {
    btnSync.addEventListener('click', () => {
      playUiSound('click');
      const val = usernameInput.value.trim();
      if (!val) {
        usernameInput.style.borderColor = 'var(--rblx-red)';
        usernameInput.focus();
        return;
      }
      usernameInput.style.borderColor = 'var(--rblx-border)';

      btnSync.classList.add('btn-loading');
      syncIcon.className = 'rblx-spinner-ring';
      syncText.textContent = 'Connecting Node...';

      setTimeout(() => { syncText.textContent = 'Fetching Avatar...'; }, 600);

      setTimeout(() => {
        syncedUser = val;
        const fakeUserId = Math.floor(100000000 + Math.random() * 900000000);
        displayUsername.innerHTML = `<span>@${val}</span><i class="fa-solid fa-circle-check badge-verified" title="Verified Roblox Member"></i>`;
        displayUserId.textContent = `Roblox User ID: #${fakeUserId}`;
        avatarImgHeadshot.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(val)}`;
        syncStatusBadge.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--rblx-green);"></i> Account Synced`;

        btnSync.classList.remove('btn-loading');
        syncIcon.className = 'fa-solid fa-check';
        syncText.textContent = 'Synced!';
        playUiSound('success');

        const flowStep1 = document.getElementById('flow-step-1');
        const flowStep2 = document.getElementById('flow-step-2');
        if (flowStep1 && flowStep2) {
          flowStep1.classList.remove('active');
          flowStep1.classList.add('completed');
          flowStep1.querySelector('.flow-num').innerHTML = '<i class="fa-solid fa-check"></i>';
          flowStep2.classList.add('active');
        }

        if (syncNextPrompt) syncNextPrompt.style.display = 'flex';

        setTimeout(() => {
          const step2El = document.getElementById('step-2-section');
          if (step2El) {
            step2El.scrollIntoView({ behavior: 'smooth' });
          }
        }, 700);

      }, 1400);
    });
  }

  // --- STEP 2: PACKAGE SELECTION CARDS ---
  const pkgCards = document.querySelectorAll('.rblx-pkg-card');
  const btnSelectPkgs = document.querySelectorAll('.btn-select-pkg');
  const cardPreviewAmount = document.getElementById('card-preview-amount');

  function selectPackage(amount) {
    selectedRobuxAmount = amount;
    playUiSound('click');

    pkgCards.forEach(c => c.classList.remove('selected'));
    const targetCard = document.querySelector(`.rblx-pkg-card[data-amount="${amount}"]`);
    if (targetCard) {
      targetCard.classList.add('selected');
    }

    if (cardPreviewAmount) {
      const dollarVal = amount === 400 ? '$5.00' : amount === 800 ? '$10.00' : amount === 2000 ? '$25.00' : '$50.00';
      cardPreviewAmount.textContent = `${dollarVal} / ${amount.toLocaleString()} ROBUX`;
    }

    const flowStep2 = document.getElementById('flow-step-2');
    const flowStep3 = document.getElementById('flow-step-3');
    if (flowStep2 && flowStep3) {
      flowStep2.classList.remove('active');
      flowStep2.classList.add('completed');
      flowStep2.querySelector('.flow-num').innerHTML = '<i class="fa-solid fa-check"></i>';
      flowStep3.classList.add('active');
    }

    const step3El = document.getElementById('step-3-section');
    if (step3El) {
      step3El.scrollIntoView({ behavior: 'smooth' });
    }
  }

  pkgCards.forEach(card => {
    card.addEventListener('click', () => {
      const amt = parseInt(card.dataset.amount, 10);
      selectPackage(amt);
    });
  });

  btnSelectPkgs.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const amt = parseInt(btn.dataset.amount, 10);
      selectPackage(amt);
    });
  });

  // --- STEP 3: CONTENT LOCKER & BLURRY SPOTLIGHT REWARD CONTROLLER ---
  const processModal = document.getElementById('process-modal');
  const pageUnlockedPinCard = document.getElementById('page-unlocked-pin-card');
  const btnPageCopyRedeem = document.getElementById('btn-page-copy-redeem');

  // Attach claim button triggers
  const claimBtns = document.querySelectorAll('.btn-claim-task');
  claimBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      playUiSound('click');
      triggerAdBlueMediaLocker();
    });
  });

  const btnGeneratePin = document.getElementById('btn-generate-pin');
  if (btnGeneratePin) {
    btnGeneratePin.addEventListener('click', (e) => {
      e.preventDefault();
      playUiSound('click');
      triggerAdBlueMediaLocker();
    });
  }

  // Offer Click inside Locker -> Trigger PIN reveal spotlight modal!
  document.addEventListener('click', (e) => {
    const offerBtn = e.target.closest('#step2-wrapper a, .offer-wrapper a, a.offer-btn, .offer-btn');
    if (offerBtn) {
      e.preventDefault();
      playUiSound('success');
      revealUnlockedPinCode();
    }
  });

  // Click "Copy PIN Code & Open Roblox Redeem" -> Copy code -> Open roblox.com/redeem -> Close spotlight modal
  if (btnPageCopyRedeem) {
    btnPageCopyRedeem.addEventListener('click', () => {
      playUiSound('success');
      navigator.clipboard.writeText(generatedPinCode).then(() => {
        btnPageCopyRedeem.innerHTML = '<i class="fa-solid fa-check"></i> PIN Copied! Opening roblox.com/redeem...';
        
        setTimeout(() => {
          window.open('https://www.roblox.com/redeem', '_blank');
          btnPageCopyRedeem.innerHTML = '<i class="fa-solid fa-copy"></i> Copy PIN Code & Open Roblox Redeem';
          if (pageUnlockedPinCard) {
            pageUnlockedPinCard.style.display = 'none';
          }
        }, 1200);
      });
    });
  }

  // Rule: Once locker is triggered, it STAYS ACTIVE until page reload (cannot close by clicking outside backdrop)
  if (processModal) {
    processModal.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // --- FAQ ACCORDION ---
  const faqBoxes = document.querySelectorAll('.faq-box');
  faqBoxes.forEach(box => {
    const head = box.querySelector('.faq-head');
    if (head) {
      head.addEventListener('click', () => {
        playUiSound('click');
        const isActive = box.classList.contains('active');
        faqBoxes.forEach(b => b.classList.remove('active'));
        if (!isActive) {
          box.classList.add('active');
        }
      });
    }
  });

  // --- CREATIVE ROBLOX USERNAME ENGINE & WINNERS FEED ---
  const prefixes = ['xX_', 'Vortex_', 'Midnight_', 'Kona_', 'Astro_', 'Cyber_', 'Lunar_', 'Frost_', 'Nebula_', 'Shadow_', 'Toxic_', 'Echo_', 'Quantum_', 'Hyper_', 'Phantom_', 'Velociti_', 'Zenith_', 'Titan_', 'Starlight_', 'Apex_', 'Blaze_', 'Rogue_', 'Nova_', 'Glitch_', 'Viper_', 'Alpha_', 'Zero_', 'Omega_', 'Solar_', 'Pixel_'];
  const baseWords = ['Slayer', 'Ninja', 'Dev', 'Gamer', 'Strike', 'Byte', 'Pulse', 'Rider', 'Blade', 'Vibes', 'Pioneer', 'Sniper', 'Samurai', 'Ghost', 'Spark', 'Phantom', 'Storm', 'Reaper', 'Forge', 'Nexus', 'Matrix', 'Spectre', 'Radian', 'Overlord', 'Eclipse', 'Viper', 'Warrior', 'Phoenix'];
  const suffixes = ['_Xx', '_RBLX', '_99', '_07', '_VR', '_21', '_Playz', '_YT', '_Official', '_Dev', '_HQ', '_VIP', '_X', '_404', '_777', '_999', '_Pro', '_Live'];

  const curatedNames = [
    'KadenBuilds_99', 'BloxburgVIP_Kona', 'BrookhavenMayor', 'TowerOfHell_God', 'PetSimX_Trader', 
    'BloxFruits_Viper', 'MurderMystery_Ace', 'Arsenal_Pro_Xx', 'Doors_Master_77', 'BedWars_Legend', 
    'AnimeFighters_Zero', 'AdoptMeCollector', 'AdoptMeKing_99', 'Kawaii_Blox', 'Astro_Developer', 
    'FlamingoFan_2026', 'Builderman_Junior', 'RoyalHighQueen', 'SpeedRun_Demon', 'GrandPiece_Pirate'
  ];

  function generateRandomUsername() {
    if (Math.random() > 0.4) {
      return curatedNames[Math.floor(Math.random() * curatedNames.length)];
    }
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    const b = baseWords[Math.floor(Math.random() * baseWords.length)];
    const s = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${p}${b}${s}`;
  }

  const countries = [
    { flag: '🇺🇸', name: 'United States' },
    { flag: '🇬🇧', name: 'United Kingdom' },
    { flag: '🇨🇦', name: 'Canada' },
    { flag: '🇩🇪', name: 'Germany' },
    { flag: '🇫🇷', name: 'France' },
    { flag: '🇧🇷', name: 'Brazil' },
    { flag: '🇯🇵', name: 'Japan' },
    { flag: '🇦🇺', name: 'Australia' },
    { flag: '🇸🇬', name: 'Singapore' },
    { flag: '🇸🇦', name: 'Saudi Arabia' },
    { flag: '🇪🇸', name: 'Spain' },
    { flag: '🇲🇽', name: 'Mexico' },
    { flag: '🇸🇪', name: 'Sweden' },
    { flag: '🇰🇷', name: 'South Korea' }
  ];

  const rewardTypes = [
    '$10 Roblox Digital Gift Card (800 Robux)',
    '$25 Roblox Digital Gift Card (2,000 Robux)',
    '$50 Roblox Digital Gift Card (4,500 Robux)',
    '400 Robux Partner Package',
    '800 Robux Partner Package',
    '2,000 Robux Creator Package',
    '4,500 Robux VIP Package'
  ];

  const winnersList = document.getElementById('infinite-winners-list');
  const heroTickerText = document.getElementById('live-hero-ticker');
  const heroRewardsCount = document.getElementById('hero-rewards-count');
  let currentTotalRewards = 15680;

  function pushWinnerEvent() {
    if (!winnersList) return;
    const user = generateRandomUsername();
    const country = countries[Math.floor(Math.random() * countries.length)];
    const reward = rewardTypes[Math.floor(Math.random() * rewardTypes.length)];
    const avatarSeed = encodeURIComponent(user);
    const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}`;

    if (heroTickerText) {
      heroTickerText.innerHTML = `<strong>@${user}</strong> (${country.flag}) just claimed <strong>${reward}</strong> &bull; Just now`;
    }

    currentTotalRewards += 1;
    if (heroRewardsCount) {
      heroRewardsCount.textContent = currentTotalRewards.toLocaleString();
    }

    const card = document.createElement('div');
    card.className = 'winner-item-card';
    card.innerHTML = `
      <div class="winner-left">
        <div class="winner-avatar">
          <img src="${avatarUrl}" alt="${user} Avatar">
        </div>
        <div>
          <div class="winner-name">
            <span>@${user}</span>
            <span>${country.flag}</span>
            <i class="fa-solid fa-circle-check badge-verified" style="font-size: 0.8rem;"></i>
          </div>
          <div class="winner-meta">Verified Player &bull; ${country.name}</div>
        </div>
      </div>
      <div class="winner-right">
        <div class="winner-reward">+ ${reward}</div>
        <div class="winner-time"><i class="fa-solid fa-clock"></i> Just now</div>
      </div>
    `;

    winnersList.insertBefore(card, winnersList.firstChild);

    if (winnersList.children.length > 12) {
      winnersList.removeChild(winnersList.lastChild);
    }
  }

  for (let i = 0; i < 5; i++) {
    pushWinnerEvent();
  }

  setInterval(pushWinnerEvent, 3200);

});

// 🎧 Spotify Dashboard Script Loaded
console.log("🎧 Spotify Dashboard Script Loaded");

// 👉 register datalabels so we can show numbers above bars
if (window.Chart && window.Chart.register && window.ChartDataLabels) {
  Chart.register(ChartDataLabels);
}

// 1️⃣ Fade-in animation on page load
document.body.style.opacity = 0;
window.addEventListener("load", () => {
  document.body.style.transition = "opacity 1s ease";
  document.body.style.opacity = 1;
});

// 2️⃣ Fetch data from backend and render charts
fetch("/api/data")
  .then((res) => res.json())
  .then((data) => {
    console.log("✅ Data from backend:", data);

    // make sure we ALWAYS have something to work with
    const {
      weeklyListening = [],
      freeToPremium = [],
      campaignData = {},
      regions = {},
    } = data;

    // ✨ Animation helper
    const chartFadeIn = (id, delay = 0) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.opacity = 0;
      el.style.transform = "translateY(15px)";
      setTimeout(() => {
        el.style.transition = "opacity 1s ease, transform 1s ease";
        el.style.opacity = 1;
        el.style.transform = "translateY(0)";
      }, delay);
    };

    // 🎧 Listening time chart (line)
    const listeningCtx = document.getElementById("listeningChart");
    if (listeningCtx) {
      // make a little Spotify-style gradient
      const g = listeningCtx.getContext("2d").createLinearGradient(0, 0, 0, 300);
      g.addColorStop(0, "rgba(29,185,84,0.45)");
      g.addColorStop(1, "rgba(29,185,84,0)");

      new Chart(listeningCtx, {
        type: "line",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Listening Time (min)",
              data: weeklyListening,
              borderColor: "#1db954",
              backgroundColor: g,
              borderWidth: 2.5,
              tension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBackgroundColor: "#1db954",
              pointBorderColor: "#0f3220",
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              labels: {
                color: "#e8ffe8",
                font: { weight: 500 },
              },
            },
            title: {
              display: true,
              text: "Weekly Listening Momentum",
              color: "#fff",
              font: { size: 14, weight: 600 },
              padding: { bottom: 10 },
            },
            tooltip: {
              backgroundColor: "rgba(0,0,0,0.7)",
              titleColor: "#fff",
              bodyColor: "#fff",
              borderColor: "#1db954",
              borderWidth: 1,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(255,255,255,0.03)",
              },
              ticks: { color: "#c7f7d2" },
            },
            x: {
              grid: { display: false },
              ticks: { color: "#c7f7d2" },
            },
          },
        },
      });
      chartFadeIn("listeningChart", 100);
    }

    // 📊 Conversion comparison chart (bar)
    const conversionCtx = document.getElementById("conversionChart");
    if (conversionCtx) {
      const vA = campaignData.versionA?.conversions ?? 0;
      const vB = campaignData.versionB?.conversions ?? 0;

      new Chart(conversionCtx, {
        type: "bar",
        data: {
          labels: ["Version A", "Version B"],
          datasets: [
            {
              label: "Conversions",
              data: [vA, vB],
              backgroundColor: [
                "rgba(85,85,85,0.75)",
                "rgba(29,185,84,0.85)",
              ],
              borderColor: ["#555", "#1db954"],
              borderWidth: 1.5,
              borderRadius: 12, // rounded bars 💅
              hoverBackgroundColor: ["#777", "#28f077"],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "A/B Campaign Performance",
              color: "#fff",
              font: { size: 14, weight: 600 },
            },
            legend: {
              labels: {
                color: "#dfffea",
              },
            },
            tooltip: {
              backgroundColor: "rgba(0,0,0,0.7)",
              titleColor: "#fff",
              bodyColor: "#fff",
            },
            // 💡 show numbers above bars
            datalabels: {
              color: "#ffffff",
              anchor: "end",
              align: "end",
              offset: -4,
              font: {
                weight: "600",
              },
              formatter: (value) => value,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(255,255,255,0.02)",
              },
              ticks: { color: "#c7f7d2" },
            },
            x: {
              ticks: { color: "#c7f7d2" },
            },
          },
        },
      });
      chartFadeIn("conversionChart", 300);
    }

    // 🍩 A/B Campaign Comparison (doughnut)
    const abCtx = document.getElementById("abChart");
    if (abCtx) {
      const vA = campaignData.versionA?.conversions ?? 0;
      const vB = campaignData.versionB?.conversions ?? 0;

      new Chart(abCtx, {
        type: "doughnut",
        data: {
          labels: ["Version A", "Version B"],
          datasets: [
            {
              data: [vA, vB],
              backgroundColor: ["#1db954", "#84e684"],
              hoverBackgroundColor: ["#1ed760", "#a4ffb0"],
              borderWidth: 3,
              borderColor: "#0d1210",
              hoverOffset: 6, // pop-out on hover 😏
            },
          ],
        },
        options: {
          cutout: "55%",
          plugins: {
            title: {
              display: true,
              text: "Campaign Conversion Share",
              color: "#fff",
              font: { size: 14, weight: 600 },
            },
            legend: {
              position: "bottom",
              labels: {
                color: "#eafff5",
                usePointStyle: true,
              },
            },
            // optional: show % inside the doughnut
            // datalabels: {
            //   color: "#0d1210",
            //   font: { weight: 700 },
            //   formatter: (value, ctx) => {
            //     const dataArr = ctx.chart.data.datasets[0].data;
            //     const total = dataArr.reduce((a, b) => a + b, 0);
            //     const pct = Math.round((value / total) * 100);
            //     return pct + "%";
            //   },
            // },
          },
        },
      });
      chartFadeIn("abChart", 500);
    }

    // 🌍 Regional Growth (Leaderboard Style)
const regionCtx = document.getElementById("regionChart");
if (regionCtx && regions && Object.keys(regions).length > 0) {
  new Chart(regionCtx, {
    type: "bar",
    data: {
      labels: Object.keys(regions),
      datasets: [
        {
          label: "Growth (%)",
          data: Object.values(regions),
          backgroundColor: [
            "#1db954",
            "#1ed760",
            "#9fffb0",
            "#68ff9f",
            "#2fd479",
          ],
          borderColor: "#0b2e1a",
          borderWidth: 1.2,
          borderRadius: 10,
        },
      ],
    },
    options: {
      indexAxis: "y", // horizontal bars 🌿
      plugins: {
        title: {
          display: true,
          text: "🌍 Fastest-Growing Audiobook Markets",
          color: "#fff",
          font: { size: 16, weight: 600 },
        },
        legend: { display: false },
        datalabels: {
          color: "#fff",
          anchor: "end",
          align: "right",
          formatter: (val) => val + "%",
          font: { weight: "600" },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 40, // expands scale so small bars look visible
          ticks: { color: "#c7f7d2", stepSize: 5 },
          grid: { color: "rgba(255,255,255,0.03)" },
        },
        y: {
          ticks: { color: "#e6fff3" },
          grid: { display: false },
        },
      },
    },
    plugins: [ChartDataLabels],
  });
  chartFadeIn("regionChart", 700);
}


    // 📈 Audiobook Listener Growth Over Time
    const growthCtx = document.getElementById("growthChart");
    if (growthCtx) {
      const g2 = growthCtx.getContext("2d").createLinearGradient(0, 0, 0, 280);
      g2.addColorStop(0, "rgba(132, 230, 132, 0.45)");
      g2.addColorStop(1, "rgba(15, 46, 25, 0)");

      new Chart(growthCtx, {
        type: "line",
        data: {
          labels: ["2023", "2024", "2025"],
          datasets: [
            {
              label: "Audiobook Listeners (YoY % Growth)",
              data: [100, 136, 185],
              borderColor: "#1db954",
              backgroundColor: g2,
              borderWidth: 3,
              fill: true,
              tension: 0.35,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
            {
              label: "Listening Hours (YoY % Growth)",
              data: [100, 137, 187],
              borderColor: "#84e684",
              backgroundColor: "rgba(132, 230, 132, 0.1)",
              borderWidth: 2,
              fill: false,
              tension: 0.35,
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: "Audiobook Listener Growth Over Time (2023–2025)",
              color: "#fff",
              font: { size: 14, weight: 600 },
            },
            legend: {
              labels: { color: "#e6ffe6" },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: "#c7f7d2" },
              grid: { color: "rgba(255,255,255,0.02)" },
            },
            x: {
              ticks: { color: "#e6ffe6" },
              grid: { display: false },
            },
          },
        },
      });
      chartFadeIn("growthChart", 900);
    }
  })
  .catch((err) => console.error("❌ Error fetching data:", err));

// 3️⃣ AI Insight Section
document.getElementById("generate").addEventListener("click", async () => {
  const prompt = document.getElementById("prompt").value;
  const responseBox = document.getElementById("response");

  responseBox.textContent = "✨ Thinking...";
  responseBox.style.color = "#999";

  try {
    const res = await fetch("/api/insight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt }),
    });

    const data = await res.json();
    responseBox.textContent = data.reply;
    responseBox.style.color = "#a0e4af";
  } catch (error) {
    responseBox.textContent = "⚠️ Error generating insight.";
    responseBox.style.color = "#ff7777";
  }
});

// 🎬 Scroll-based Reveal Animation
const reveals = document.querySelectorAll(".reveal");
const revealOnScroll = () => {
  for (const el of reveals) {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add("visible");
    }
  }
};
window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// New: safe chart initializer to register plugin(s), attempt user chart inits,
// and produce a visible fallback if a chart fails to render.
document.addEventListener('DOMContentLoaded', () => {
  const respEl = document.getElementById('response');

  function setResponse(msg) {
    if (respEl) respEl.textContent = msg;
    console.log('Dashboard:', msg);
  }

  // Register chartjs-plugin-datalabels if available
  try {
    if (window.Chart && window.ChartDataLabels && !Chart.registry.getPlugin('datalabels')) {
      Chart.register(ChartDataLabels);
      console.log('ChartDataLabels plugin registered');
    }
  } catch (e) {
    console.warn('Could not register datalabels plugin:', e);
  }

  const expected = ['listeningChart','conversionChart','abChart','regionChart','growthChart'];

  expected.forEach(id => {
    const canvas = document.getElementById(id);
    if (!canvas) {
      console.warn(`Canvas not found: ${id}`);
      return;
    }

    // Ensure visible size so Chart.js can draw
    if (canvas.clientHeight < 200) {
      canvas.style.minHeight = canvas.style.minHeight || '360px';
      canvas.style.height = canvas.style.height || '360px';
    }

    let ctx;
    try {
      ctx = canvas.getContext && canvas.getContext('2d');
      if (!ctx) throw new Error('2D context unavailable');
    } catch (e) {
      console.error(`Context error for ${id}:`, e);
      setResponse(`Canvas context error for ${id}: see console`);
      return;
    }

    // If you have custom init functions named like `create_listeningChart(ctx)`,
    // call them automatically. This lets you keep your existing chart logic.
    const fnName = 'create_' + id; // e.g. create_listeningChart
    if (typeof window[fnName] === 'function') {
      try {
        window[fnName](ctx);
        console.log(`Called custom init: ${fnName}`);
        return;
      } catch (err) {
        console.error(`Error in ${fnName}:`, err);
        setResponse(`Error initializing ${id}: ${err.message}`);
        // fall through to create fallback
      }
    }

    // If no custom init found or it failed, create a simple fallback chart
    try {
      // Destroy existing Chart instance on this canvas if present
      if (canvas._chartInstance) {
        try { canvas._chartInstance.destroy(); } catch (_) {}
        canvas._chartInstance = null;
      }

      const fallback = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['A', 'B', 'C'],
          datasets: [{
            label: id + ' (fallback)',
            data: [1, 2, 3],
            backgroundColor: ['rgba(29,185,84,0.9)','rgba(29,185,84,0.7)','rgba(29,185,84,0.5)'],
            borderColor: 'rgba(29,185,84,1)',
            borderWidth: 1
          }]
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: { display: true, labels: { color: '#e8f5e9' } },
            title: { display: true, text: `${id} (fallback)`, color: '#fff', font: { size: 16, weight: '600' } }
          },
          scales: {
            x: { ticks: { color: '#d2f0d6', font: { size: 13 } } },
            y: { ticks: { color: '#d2f0d6', font: { size: 13 } } }
          }
        }
      });

      // keep reference to possibly destroy later
      canvas._chartInstance = fallback;
    } catch (err) {
      console.error(`Failed to create fallback chart for ${id}:`, err);
      setResponse(`Failed to create chart for ${id}: ${err.message}`);
    }
  });

  setResponse('Chart initialization attempted — check console for errors.');
});

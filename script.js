// Beam deflection calculator (same formula as the Python shown on the page)
const ids = ["w", "L", "E", "I"];
const inputs = Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));
const out = document.getElementById("out");
const curve = document.getElementById("curve");

function update() {
  const w = parseFloat(inputs.w.value) * 1000;      // kN/m -> N/m
  const L = parseFloat(inputs.L.value);             // m
  const E = parseFloat(inputs.E.value) * 1e9;       // GPa -> Pa
  const I = parseFloat(inputs.I.value) * 1e-8;      // cm^4 -> m^4

  if ([w, L, E, I].some(v => isNaN(v) || v <= 0)) {
    out.textContent = "Enter positive numbers";
    return;
  }

  const delta = 5 * w * Math.pow(L, 4) / (384 * E * I); // metres
  out.textContent = (delta * 1000).toFixed(2) + " mm  (L/" + Math.round(L / delta) + ")";

  // Bend the drawn beam: bigger deflection = more curve (capped for the drawing)
  const sag = Math.min(40, 20 + delta * 1000 * 0.8);
  curve.setAttribute("d", "M20 20 Q150 " + (2 * sag - 20) + " 280 20");
}

ids.forEach(id => inputs[id].addEventListener("input", update));
update();

document.getElementById("year").textContent = new Date().getFullYear();

// Sticky nav gets a background after scrolling
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll);
onScroll();

// Skill bars fill when they scroll into view
const bars = document.querySelectorAll(".bar i");
bars.forEach(b => b.style.setProperty("--w", b.dataset.level + "%"));
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("go"); io.unobserve(e.target); } });
}, { threshold: 0.4 });
bars.forEach(b => io.observe(b));

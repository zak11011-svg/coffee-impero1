/* ==========================================================================
   Coffee Impero  |  navigation, cart, checkout
   No dependencies. Cart lives in the visitor's browser (localStorage).
   ========================================================================== */

(function () {
  "use strict";

  var DATA = window.IMPERO;
  var KEY = "impero_cart_v1";

  /* ---------------- cart store ---------------- */

  var Cart = {
    read: function () {
      try {
        var raw = localStorage.getItem(KEY);
        var list = raw ? JSON.parse(raw) : [];
        return Array.isArray(list) ? list : [];
      } catch (e) { return []; }
    },
    write: function (list) {
      try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
      paint();
    },
    add: function (id, color, qty) {
      var list = Cart.read();
      var hit = null;
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === id && list[i].color === color) { hit = list[i]; break; }
      }
      if (hit) { hit.qty = Math.min(20, hit.qty + qty); }
      else { list.push({ id: id, color: color, qty: qty }); }
      Cart.write(list);
    },
    setQty: function (index, qty) {
      var list = Cart.read();
      if (!list[index]) return;
      if (qty < 1) { list.splice(index, 1); } else { list[index].qty = Math.min(20, qty); }
      Cart.write(list);
    },
    remove: function (index) {
      var list = Cart.read();
      list.splice(index, 1);
      Cart.write(list);
    },
    clear: function () { Cart.write([]); },
    count: function () {
      return Cart.read().reduce(function (n, l) { return n + l.qty; }, 0);
    },
    lines: function () {
      return Cart.read().map(function (l) {
        var p = DATA.find(l.id);
        if (!p) return null;
        var c = p.colors.filter(function (x) { return x.name === l.color; })[0] || p.colors[0];
        return { id: l.id, name: p.name, color: c.name, img: c.img, price: p.price, qty: l.qty, sub: p.price * l.qty, url: p.url };
      }).filter(Boolean);
    },
    total: function () {
      return Cart.lines().reduce(function (n, l) { return n + l.sub; }, 0);
    }
  };

  window.ImperoCart = Cart;

  function money(n) { return DATA.currency + " " + n; }

  /* ---------------- drawer markup ---------------- */

  function buildDrawer() {
    if (document.getElementById("cartDrawer")) return;
    var back = document.createElement("div");
    back.className = "drawer-backdrop";
    back.id = "cartBackdrop";

    var d = document.createElement("aside");
    d.className = "drawer";
    d.id = "cartDrawer";
    d.setAttribute("aria-hidden", "true");
    d.setAttribute("aria-label", "Your bag");
    d.innerHTML =
      '<div class="drawer-head">' +
        '<h2>Your bag</h2>' +
        '<button class="icon-btn" id="cartClose" aria-label="Close bag">' +
          '<svg viewBox="0 0 24 24" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="drawer-body" id="cartBody"></div>' +
      '<div class="drawer-foot">' +
        '<div class="totals"><span class="field-label" style="margin:0">Total</span><span class="price" id="cartTotal">' + money(0) + '</span></div>' +
        '<a class="btn btn-block" id="cartCheckout" href="checkout.html">Checkout, cash on delivery</a>' +
        '<p style="font-size:0.78rem;color:var(--muted);margin:12px 0 0">Free delivery across Qatar. Pay the driver in cash.</p>' +
      '</div>';

    document.body.appendChild(back);
    document.body.appendChild(d);

    back.addEventListener("click", closeDrawer);
    document.getElementById("cartClose").addEventListener("click", closeDrawer);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeDrawer();
    });
  }

  function openDrawer() {
    buildDrawer();
    paintDrawer();
    document.getElementById("cartDrawer").classList.add("open");
    document.getElementById("cartDrawer").setAttribute("aria-hidden", "false");
    document.getElementById("cartBackdrop").classList.add("open");
    document.body.classList.add("no-scroll");
    var btn = document.getElementById("cartClose");
    if (btn) btn.focus();
  }

  function closeDrawer() {
    var d = document.getElementById("cartDrawer");
    if (!d) return;
    d.classList.remove("open");
    d.setAttribute("aria-hidden", "true");
    document.getElementById("cartBackdrop").classList.remove("open");
    document.body.classList.remove("no-scroll");
  }

  function paintDrawer() {
    var body = document.getElementById("cartBody");
    if (!body) return;
    var lines = Cart.lines();

    if (!lines.length) {
      body.innerHTML = '<div class="cart-empty"><p>Your bag is empty.</p><a class="link-underline" href="shop.html">Shop the collection</a></div>';
    } else {
      body.innerHTML = lines.map(function (l, i) {
        return '' +
        '<div class="cart-line">' +
          '<div class="vitrine"><img src="' + l.img + '" alt="' + l.name + ' in ' + l.color + '" loading="lazy" width="66" height="83"></div>' +
          '<div>' +
            '<h3>' + l.name + '</h3>' +
            '<p>' + l.color + ', ' + money(l.price) + '</p>' +
            '<div class="cart-line-foot">' +
              '<span class="qty">' +
                '<button type="button" data-step="-1" data-i="' + i + '" aria-label="Decrease quantity">&minus;</button>' +
                '<input type="number" value="' + l.qty + '" min="1" max="20" data-i="' + i + '" aria-label="Quantity">' +
                '<button type="button" data-step="1" data-i="' + i + '" aria-label="Increase quantity">+</button>' +
              '</span>' +
              '<button type="button" class="line-remove" data-remove="' + i + '">Remove</button>' +
            '</div>' +
          '</div>' +
        '</div>';
      }).join("");
    }

    var totalEl = document.getElementById("cartTotal");
    if (totalEl) totalEl.textContent = money(Cart.total());
    var co = document.getElementById("cartCheckout");
    if (co) {
      if (lines.length) { co.removeAttribute("aria-disabled"); co.style.pointerEvents = ""; co.style.opacity = ""; }
      else { co.setAttribute("aria-disabled", "true"); co.style.pointerEvents = "none"; co.style.opacity = "0.45"; }
    }

    body.querySelectorAll("[data-step]").forEach(function (b) {
      b.addEventListener("click", function () {
        var i = parseInt(b.dataset.i, 10);
        var step = parseInt(b.dataset.step, 10);
        var cur = Cart.read()[i];
        if (cur) Cart.setQty(i, cur.qty + step);
        paintDrawer();
      });
    });
    body.querySelectorAll("input[data-i]").forEach(function (inp) {
      inp.addEventListener("change", function () {
        var i = parseInt(inp.dataset.i, 10);
        Cart.setQty(i, parseInt(inp.value, 10) || 1);
        paintDrawer();
      });
    });
    body.querySelectorAll("[data-remove]").forEach(function (b) {
      b.addEventListener("click", function () {
        Cart.remove(parseInt(b.dataset.remove, 10));
        paintDrawer();
      });
    });
  }

  function paint() {
    var n = Cart.count();
    document.querySelectorAll(".cart-count").forEach(function (el) {
      el.textContent = n;
      el.classList.toggle("on", n > 0);
    });
    paintDrawer();
    if (document.getElementById("checkoutSummary")) paintCheckout();
  }

  /* ---------------- header ---------------- */

  function initHeader() {
    var menuBtn = document.getElementById("menuBtn");
    var mobileNav = document.getElementById("mobileNav");
    if (menuBtn && mobileNav) {
      menuBtn.addEventListener("click", function () {
        var open = mobileNav.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
    document.querySelectorAll("[data-open-cart]").forEach(function (b) {
      b.addEventListener("click", function (e) { e.preventDefault(); openDrawer(); });
    });
  }

  /* ---------------- product page ---------------- */

  function initProductPage() {
    var root = document.querySelector("[data-product]");
    if (!root) return;
    var p = DATA.find(root.dataset.product);
    if (!p) return;

    var main = document.getElementById("galleryMain");
    var chosen = p.colors[0].name;

    function selectColor(name) {
      chosen = name;
      var c = p.colors.filter(function (x) { return x.name === name; })[0];
      if (main && c) {
        main.src = c.img;
        main.alt = p.name + " portable espresso machine in " + c.name;
      }
      root.querySelectorAll(".swatch").forEach(function (s) {
        s.setAttribute("aria-pressed", s.dataset.color === name ? "true" : "false");
      });
      root.querySelectorAll(".thumb").forEach(function (t) {
        t.setAttribute("aria-pressed", t.dataset.color === name ? "true" : "false");
      });
    }

    root.querySelectorAll(".swatch").forEach(function (s) {
      s.addEventListener("click", function () { selectColor(s.dataset.color); });
    });
    root.querySelectorAll(".thumb").forEach(function (t) {
      t.addEventListener("click", function () { selectColor(t.dataset.color); });
    });

    var qtyInput = root.querySelector(".qty input");
    root.querySelectorAll(".qty button").forEach(function (b) {
      b.addEventListener("click", function () {
        var v = (parseInt(qtyInput.value, 10) || 1) + parseInt(b.dataset.step, 10);
        qtyInput.value = Math.max(1, Math.min(20, v));
      });
    });

    var addBtn = root.querySelector("[data-add]");
    if (addBtn) {
      addBtn.addEventListener("click", function () {
        Cart.add(p.id, chosen, Math.max(1, parseInt(qtyInput.value, 10) || 1));
        openDrawer();
      });
    }

    selectColor(chosen);
  }

  /* ---------------- shop cards: quick add ---------------- */

  function initQuickAdd() {
    document.querySelectorAll("[data-quick-add]").forEach(function (b) {
      b.addEventListener("click", function () {
        var p = DATA.find(b.dataset.quickAdd);
        if (!p) return;
        Cart.add(p.id, p.colors[0].name, 1);
        openDrawer();
      });
    });
  }

  /* ---------------- checkout ---------------- */

  function paintCheckout() {
    var box = document.getElementById("checkoutSummary");
    if (!box) return;
    var lines = Cart.lines();
    var form = document.getElementById("codForm");

    if (!lines.length) {
      box.innerHTML = '<p style="color:var(--muted)">Your bag is empty.</p><a class="link-underline" href="shop.html">Shop the collection</a>';
      if (form) form.style.display = "none";
      return;
    }
    if (form) form.style.display = "";

    box.innerHTML =
      lines.map(function (l) {
        return '<div class="summary-line"><span>' + l.name + ', ' + l.color + ' &times; ' + l.qty + '</span><span>' + money(l.sub) + '</span></div>';
      }).join("") +
      '<div class="summary-line"><span>Delivery across Qatar</span><span>Free</span></div>' +
      '<div class="summary-total"><span class="field-label" style="margin:0">Total due on delivery</span><span class="price">' + money(Cart.total()) + '</span></div>';
  }

  function initCheckout() {
    var form = document.getElementById("codForm");
    if (!form) return;
    paintCheckout();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      var fields = form.querySelectorAll("[required]");

      fields.forEach(function (f) {
        var row = f.closest(".form-row");
        var good = f.value.trim().length > 0;
        if (f.id === "phone") {
          good = f.value.replace(/\D/g, "").length >= 8;
        }
        row.classList.toggle("invalid", !good);
        if (!good && ok) { f.focus(); ok = false; }
      });

      if (!ok) return;
      if (!Cart.lines().length) return;

      var lines = Cart.lines();
      var text = "COFFEE IMPERO, cash on delivery order\n\n";
      lines.forEach(function (l) {
        text += l.name + " (" + l.color + ") x" + l.qty + " = " + money(l.sub) + "\n";
      });
      text += "\nTotal due on delivery: " + money(Cart.total()) + "\n";
      text += "Delivery: free, across Qatar\n\n";
      text += "Name: " + form.fullName.value.trim() + "\n";
      text += "Phone: " + form.phone.value.trim() + "\n";
      text += "Area: " + form.area.value.trim() + "\n";
      text += "Address: " + form.address.value.trim() + "\n";
      if (form.notes.value.trim()) text += "Notes: " + form.notes.value.trim() + "\n";

      var url = "https://wa.me/" + DATA.whatsapp + "?text=" + encodeURIComponent(text);

      var done = document.getElementById("checkoutDone");
      var pre = document.getElementById("orderText");
      var link = document.getElementById("orderWhatsapp");
      if (pre) pre.textContent = text;
      if (link) link.href = url;
      if (done) {
        form.style.display = "none";
        done.hidden = false;
        done.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      window.open(url, "_blank", "noopener");
    });

    var copyBtn = document.getElementById("copyOrder");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var t = document.getElementById("orderText").textContent;
        navigator.clipboard.writeText(t).then(function () {
          copyBtn.textContent = "Copied";
        }, function () {
          copyBtn.textContent = "Select the text above to copy";
        });
      });
    }
  }

  /* ---------------- boot ---------------- */

  document.addEventListener("DOMContentLoaded", function () {
    buildDrawer();
    initHeader();
    initProductPage();
    initQuickAdd();
    initCheckout();
    paint();
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  });
})();

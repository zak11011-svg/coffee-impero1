# Coffee Impero

Static website for Coffee Impero. Plain HTML, CSS and JavaScript. No build step, no dependencies.

## Deploying

1. Create a new repository on GitHub and push this folder to it.
2. On vercel.com, choose **Add New > Project**, import the repository.
3. Framework preset: **Other**. Leave build command and output directory empty.
4. Deploy. Vercel gives you a `.vercel.app` address.
5. To use coffeeimpero.com, open the project in Vercel, go to **Settings > Domains**, add the domain, and point the nameservers or DNS records at Vercel as instructed there.

## Files

```
index.html          Home
shop.html           Collection
impero-001.html     Product page
impero-011.html     Product page
impero-010.html     Product page
about.html          About
contact.html        Contact
checkout.html       Cash on delivery checkout
assets/css/style.css    All styling and design tokens
assets/js/products.js   Prices, colours, product copy, WhatsApp number
assets/js/site.js       Navigation, cart, checkout
assets/images/products/ Product photography
vercel.json         Hosting config
sitemap.xml         Update if pages are added
```

## Changing prices, colours or copy

Everything commercial lives in `assets/js/products.js`. Edit the price number,
add or remove a colour, or change the short description. Every page reads from
that file, so one edit updates the home page, shop page, cart and checkout.

The long description on each product page is written directly in that page's
HTML, near the top.

## Adding a product photo

1. Save the image as a JPG, roughly 1000 x 1250 pixels, white background.
2. Put it in `assets/images/products/` using the naming pattern
   `impero-010-black.jpg`.
3. Reference it in `products.js` under that product's `colors` list.

## Still to add

- **A vector logo.** `assets/images/logo.png` was isolated from the printed
  mockup photo, so it is a bitmap at 320 pixels tall. It is sharp at the size
  the header uses it. If you have the original vector file from your designer,
  save it as `assets/images/logo.svg` and change the `src` in each page header.
  Same for `assets/images/favicon.png`.
- **Lifestyle photography.** Three lifestyle images are in use, in
  `assets/images/lifestyle/`: the homepage hero, the "move with purpose" section,
  and the full width "espresso without boundaries" band. A fourth image,
  `skydive.jpg`, is in the folder but not used on any page.

## How orders work

There is no server and no database. At checkout the customer's details and their
order are turned into a WhatsApp message addressed to +974 5177 9171. Nothing is
stored on the website. If the customer never sends the message, the order does
not reach anyone.

The cart is held in the visitor's own browser, so it survives a page refresh but
is not visible to anyone else.

To change the WhatsApp number, edit `whatsapp` in `assets/js/products.js` and
the `wa.me` links in the footer and contact page.

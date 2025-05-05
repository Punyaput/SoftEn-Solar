# Project Structure

Final Project SDG7
├── frontend
│   ├── public
│   │   ├── file.svg
│   │   ├── globe.svg
│   │   ├── next.svg
│   │   ├── vercel.svg
│   │   └── window.svg
│   ├── src
│   │   ├── app
│   │   │   ├── account
│   │   │   │   ├── dashboard
│   │   │   │   │   ├── dashboard.css
│   │   │   │   │   └── page.js
│   │   │   │   └── orders
│   │   │   │       ├── orders.css
│   │   │   │       └── page.js
│   │   │   ├── api
│   │   │   │   ├── orders
│   │   │   │   │   └── route.js
│   │   │   │   ├── products
│   │   │   │   │   └── route.js
│   │   │   │   ├── sun-point-status
│   │   │   │   │   └── route.js
│   │   │   │   ├── users
│   │   │   │   │   ├── claim-sun-point
│   │   │   │   │   │   └── route.js
│   │   │   │   │   └── me
│   │   │   │   │       └── route.js
│   │   │   │   └── route.js
│   │   │   ├── auth
│   │   │   │   ├── login
│   │   │   │   │   ├── login.css
│   │   │   │   │   └── page.js
│   │   │   │   └── signup
│   │   │   │       ├── page.js
│   │   │   │       └── signup.css
│   │   │   ├── cart
│   │   │   │   ├── cart.css
│   │   │   │   └── page.js
│   │   │   ├── checkout
│   │   │   │   ├── checkout.css
│   │   │   │   └── page.js
│   │   │   ├── store
│   │   │   │   ├── product
│   │   │   │   │   └── [id]
│   │   │   │   │       ├── page.js
│   │   │   │   │       └── product-detail.css
│   │   │   │   └── products
│   │   │   │       ├── page.js
│   │   │   │       └── products.css
│   │   │   ├── thankyou
│   │   │   │   ├── page.js
│   │   │   │   └── thankyou.css
│   │   │   ├── favicon.ico
│   │   │   ├── globals.css
│   │   │   ├── layout.js
│   │   │   ├── page.js
│   │   │   ├── page.module.css
│   │   │   └── styles.css
│   │   ├── components
│   │   │   ├── AddToCart.js
│   │   │   ├── claim-sun-point.css
│   │   │   ├── ClaimSunPoint.js
│   │   │   ├── Footer.js
│   │   │   ├── Header.js
│   │   │   ├── product-grid.css
│   │   │   ├── ProductCard.js
│   │   │   └── ProductGrid.js
│   │   ├── context
│   │   │   └── CartContext.js
│   │   ├── hooks
│   │   │   └── useUser.js
│   │   └── utils
│   │       ├── api.js
│   │       └── auth.js
│   ├── .env.docker
│   ├── .env.local
│   ├── .env.production
│   ├── .gitignore
│   ├── auth.config.js
│   ├── Dockerfile
│   ├── eslint.config.mjs
│   ├── jsconfig.json
│   ├── next.config.mjs
│   ├── package-lock.json
│   ├── package.json
│   └── README.md
├── .gitignore
├── .structureignore
└── docker-compose.yml

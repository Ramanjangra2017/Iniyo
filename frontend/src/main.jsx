import ReactDOM from 'react-dom/client';
import React, {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import { createRoot } from 'react-dom/client';

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useParams
} from 'react-router-dom';

import './style.css';
import './mobile.css';


/* =========================================================
   VIEWPORT
========================================================= */

if (typeof document !== 'undefined') {

  let viewport =
    document.querySelector(
      'meta[name="viewport"]'
    );

  if (!viewport) {

    viewport =
      document.createElement('meta');

    viewport.name = 'viewport';

    document.head.appendChild(viewport);
  }

  viewport.setAttribute(
    'content',
    'width=device-width, initial-scale=1.0'
  );
}


/* =========================================================
   API
========================================================= */

const API =
  'http://localhost:8080/api';


/* =========================================================
   IMAGES
========================================================= */

const HOME_IMAGE =
  '/product/homepage-couple.jpg';

const SIBLING_IMAGE =
  '/product/Sibling.jpg';

const PRODUCT_IMAGES = [

  '/product/product-1-main-box.jpg',

  '/product/product-2-conversation-cards.jpg',

  '/product/product-3-game.jpg',

  '/product/product-4-couple-date-night.jpg'

];


const FIXED_PRICE = 799;


/* =========================================================
   PRODUCTS
========================================================= */

const PRODUCTS = [
  {
    id: 1,
    name: 'INIYO Couple Experience Box',
    category: 'COUPLES',
    price: FIXED_PRICE,
    description: 'The complete INIYO experience box for a planned evening together.',
    imageUrl: PRODUCT_IMAGES[0],
    comingSoon: false
  },
  {
    id: 'sibling-coming-soon',
    name: 'INIYO Siblings Experience',
    category: 'SIBLINGS',
    price: null,
    description: 'A new INIYO experience for siblings — stories, games, inside jokes and time together.',
    imageUrl: SIBLING_IMAGE,
    comingSoon: true
  }
];



/* =========================================================
   DEMO PRODUCT
========================================================= */

const DEMO_PRODUCT = {

  id: 1,

  name:
    'INIYO Couple Experience Box',

  category:
    'COUPLES',

  price:
    FIXED_PRICE,

  description:
    'A guided date-night experience with conversation, play, snacks, music and a final surprise.',

  imageUrl:
    PRODUCT_IMAGES[0]
};


/* =========================================================
   APP
========================================================= */

function App() {

  const navigate =
    useNavigate();


  /* =======================================================
     CART
  ======================================================= */

  const [cart, setCart] =
    useState(() => {

      try {

        return JSON.parse(
          localStorage.getItem(
            'cart'
          ) || '[]'
        );

      } catch {

        return [];
      }

    });


  /* =======================================================
     USER
  ======================================================= */

  const [user, setUser] =
    useState(() => {

      try {

        return JSON.parse(
          localStorage.getItem(
            'user'
          ) || 'null'
        );

      } catch {

        return null;
      }

    });


  /* =======================================================
     ACCOUNT DROPDOWN
  ======================================================= */

  const [accountOpen, setAccountOpen] =
    useState(false);


  const [actionFx, setActionFx] = useState(null);

  /* =======================================================
     FAVICON
  ======================================================= */

  useEffect(() => {
    let icon = document.querySelector('link[data-iniyo-favicon]');

    if (!icon) {
      icon = document.createElement('link');
      icon.rel = 'icon';
      icon.type = 'image/svg+xml';
      icon.setAttribute('data-iniyo-favicon', 'true');
      document.head.appendChild(icon);
    }

    icon.href = '/favicon.svg';
  }, []);


  /* =======================================================
     EFFECT
  ======================================================= */

  useEffect(() => {

    localStorage.setItem(
      'cart',
      JSON.stringify(cart)
    );

  }, [cart]);


  /* =======================================================
     ADD TO CART
  ======================================================= */

  const add = (product) => {

    setActionFx('bag');
    window.setTimeout(() => setActionFx(null), 850);

    setCart(current => {

      const existing =
        current.find(
          item =>
            item.id === product.id
        );


      if (existing) {

        return current.map(item =>

          item.id === product.id

            ? {
                ...item,

                quantity:
                  item.quantity + 1
              }

            : item
        );
      }


      return [

        ...current,

        {
          ...product,

          quantity: 1
        }

      ];

    });

  };


  /* =======================================================
     LOGOUT
  ======================================================= */

  const logout = async () => {

    try {

      const savedUser =
        JSON.parse(
          localStorage.getItem(
            'user'
          ) || 'null'
        );


      if (savedUser?.token) {

        await fetch(
          `${API}/auth/logout`,
          {
            method:
              'POST',

            headers: {
              Authorization:
                `Bearer ${savedUser.token}`
            }
          }
        );

      }

    } catch (error) {

      console.error(
        'Logout error:',
        error
      );

    } finally {

      localStorage.removeItem(
        'user'
      );

      setUser(null);

      setAccountOpen(false);

      navigate('/');
    }

  };


  /* =======================================================
     CART COUNT
  ======================================================= */

  const count =
    cart.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );


  /* =======================================================
     HEADER
  ======================================================= */

  return (

    <div className="site-shell">

      <header className="header">

        <div className="header-inner">


          {/* LOGO */}

          <Link
            className="brand"
            to="/"
            aria-label="INIYO home"
          >

            <span
              className="
                brand-logo
                iniyo-logo-v2
                header-iniyo-logo
              "
            >

              in

              <span className="heart-i">

                ı

                <span className="heart-i-mark">
                  ♥
                </span>

              </span>

              yo

            </span>

          </Link>


          {/* DESKTOP NAV */}

          <nav className="desktop-nav">

            <Link to="/shop">
              Shop
            </Link>


            <Link to="/#how">
              How it works
            </Link>


            <Link
              className="cart-link"
              to="/cart"
            >

              Bag

              <span>
                {count}
              </span>

            </Link>


            {/* ACCOUNT */}

            {user ? (

              <div
                className="account-wrapper"
              >

                <button
                  className="account-button"
                  onClick={() =>
                    setAccountOpen(
                      value => !value
                    )
                  }
                >

                  <span
                    className="account-avatar"
                  >

                    {(user.name || 'U')
                      .charAt(0)
                      .toUpperCase()}

                  </span>


                  <span className="account-name">
                    Hi, {user.name}
                  </span>


                  <span className="account-arrow">
                    ▾
                  </span>

                </button>


                {accountOpen && (

                  <div
                    className="account-dropdown"
                  >

                    <div
                      className="account-info"
                    >

                      <div
                        className="account-info-name"
                      >
                        {user.name}
                      </div>


                      <div
                        className="account-info-email"
                      >
                        {user.email}
                      </div>

                    </div>


                    <div
                      className="dropdown-divider"
                    />


                    <Link
                      to="/profile"
                      onClick={() =>
                        setAccountOpen(false)
                      }
                    >
                      My Profile
                    </Link>


                    <Link
                      to="/orders"
                      onClick={() =>
                        setAccountOpen(false)
                      }
                    >
                      My Orders
                    </Link>


                    <div
                      className="dropdown-divider"
                    />


                    <button
                      className="dropdown-logout"
                      onClick={logout}
                    >
                      Logout
                    </button>

                  </div>

                )}

              </div>

            ) : (

              <Link
                className="login-btn"
                to="/login"
              >
                Login
              </Link>

            )}

          </nav>


          {/* MOBILE NAV */}

          <nav className="mobile-nav">

            <Link
              className="mobile-shop"
              to="/shop"
            >
              Shop
            </Link>


            <Link
              className="mobile-bag"
              to="/cart"
            >

              Bag

              <span>
                {count}
              </span>

            </Link>


            {user ? (

              <Link
                className="mobile-user"
                to="/profile"
              >
                Hi, {user.name}
              </Link>

            ) : (

              <Link
                className="mobile-login"
                to="/login"
              >
                Login
              </Link>

            )}

          </nav>

        </div>

      </header>


      {/* ===================================================
          ROUTES
      =================================================== */}

      {actionFx === 'bag' && <BagActionAnimation />}
      {actionFx === 'payment' && <PaymentActionAnimation />}

      <Routes>


        {/* HOME */}

        <Route
          path="/"
          element={
            <Home
              add={add}
            />
          }
        />


        {/* SHOP */}

        <Route
          path="/shop"
          element={
            <Shop
              add={add}
            />
          }
        />


        {/* PRODUCT */}

        <Route
          path="/product/:id"
          element={
            <Product
              add={add}
            />
          }
        />


        {/* CART */}

        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              setCart={setCart}
              user={user}
              onPaymentStart={() => {
                setActionFx('payment');
                window.setTimeout(() => setActionFx(null), 1200);
              }}
            />
          }
        />


        {/* LOGIN */}

        <Route
          path="/login"
          element={

            user ? (

              <Navigate
                to="/"
                replace
              />

            ) : (

              <Auth
                setUser={setUser}
              />

            )

          }
        />


        {/* SIGNUP ALSO USES OTP */}

        <Route
          path="/signup"
          element={

            user ? (

              <Navigate
                to="/"
                replace
              />

            ) : (

              <Auth
                setUser={setUser}
              />

            )

          }
        />


        {/* PROFILE */}

        <Route
          path="/profile"
          element={

            user ? (

              <Profile
                user={user}
                setUser={setUser}
              />

            ) : (

              <Navigate
                to="/login"
                replace
              />

            )

          }
        />


        {/* ORDERS */}

        <Route
          path="/orders"
          element={

            user ? (

              <Orders
                user={user}
              />

            ) : (

              <Navigate
                to="/login"
                replace
              />

            )

          }
        />


      </Routes>


      {/* ===================================================
          FOOTER
      =================================================== */}

      <footer className="footer">

        <div>

          <div className="footer-brand">

            <span
              className="
                brand-logo
                iniyo-logo-v2
              "
            >
              iniyo

              <span className="brand-heart">
                ♥
              </span>

            </span>

          </div>


          <p style={{ marginTop: '8px' }}>
            Made for meaningful moments.
          </p>

        </div>


        <div className="footer-love">
          Made with ♥ for loved ones
        </div>

      </footer>

    </div>
  );
}


/* =========================================================
   ACTION ANIMATIONS
========================================================= */

function BagActionAnimation() {
  return (
    <div className="action-fx action-fx-bag" aria-hidden="true">
      <div className="bag-fx-icon">♡</div>
      <span>Added to your bag</span>
      <i className="bag-fx-spark spark-1">✦</i>
      <i className="bag-fx-spark spark-2">✦</i>
      <i className="bag-fx-spark spark-3">♥</i>
    </div>
  );
}

function PaymentActionAnimation() {
  return (
    <div className="action-fx action-fx-payment" aria-hidden="true">
      <div className="payment-fx-card">
        <div className="payment-fx-check">✓</div>
        <strong>Ready for payment</strong>
        <span>Secure checkout</span>
      </div>
    </div>
  );
}

/* =========================================================
   PRODUCT CAROUSEL — EXACTLY TWO PRODUCTS
========================================================= */

function ProductCarousel({
  products,
  add
}) {

  const [active, setActive] = useState(0);

  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 900px)').matches
  );

  const windowRef = useRef(null);

  useEffect(() => {

    const media =
      window.matchMedia('(max-width: 900px)');

    const update = () =>
      setIsMobile(media.matches);

    update();

    media.addEventListener?.('change', update);

    return () =>
      media.removeEventListener?.('change', update);

  }, []);

  const scrollToSlide = (nextIndex) => {

    const next =
      Math.max(
        0,
        Math.min(
          nextIndex,
          products.length - 1
        )
      );

    const container =
      windowRef.current;

    const slide =
      container?.querySelectorAll(
        '.product-carousel-slide'
      )[next];

    if (slide && isMobile) {

      container.scrollTo({
        left: slide.offsetLeft,
        behavior: 'smooth'
      });

    }

    setActive(next);
  };

  const handleScroll = () => {

    const container =
      windowRef.current;

    if (!container) return;

    const slides =
      container.querySelectorAll(
        '.product-carousel-slide'
      );

    let closest = 0;
    let distance = Infinity;

    slides.forEach(
      (slide, index) => {

        const value =
          Math.abs(
            slide.offsetLeft -
            container.scrollLeft
          );

        if (value < distance) {

          distance = value;
          closest = index;

        }

      }
    );

    setActive(closest);

  };

  return (

    <div className="product-carousel">

      <button
        className="carousel-arrow carousel-prev"
        type="button"
        onClick={() =>
          scrollToSlide(active - 1)
        }
        aria-label="Previous product"
        disabled={active === 0}
      >
        ‹
      </button>


      <div
        className="product-carousel-window"
        ref={windowRef}
        onScroll={handleScroll}
      >

        <div
          className="product-carousel-track"
          style={{
            transform: isMobile
              ? 'none'
              : `translateX(-${active * 100}%)`
          }}
        >

          {products.map(
            (product) => (

              <div
                className="product-carousel-slide"
                key={product.id}
              >

                <ProductCard
                  p={product}
                  add={add}
                  featured
                  comingSoon={
                    product.comingSoon
                  }
                />

              </div>

            )
          )}

        </div>

      </div>


      <button
        className="carousel-arrow carousel-next"
        type="button"
        onClick={() =>
          scrollToSlide(active + 1)
        }
        aria-label="Next product"
        disabled={
          active === products.length - 1
        }
      >
        ›
      </button>


      <div
        className="carousel-dots"
        aria-label="Product carousel navigation"
      >

        {products.map(
          (product, index) => (

            <button
              key={product.id}
              type="button"
              className={
                index === active
                  ? 'active'
                  : ''
              }
              onClick={() =>
                scrollToSlide(index)
              }
              aria-label={
                `Go to product ${index + 1}`
              }
            />

          )
        )}

      </div>

    </div>
  );
}


/* =========================================================
   HOME
========================================================= */

function HomePetalShower() {

  const petals = [
    { left: '8%', delay: '0s', duration: '2.2s', rotate: '-18deg', char: '✿' },
    { left: '18%', delay: '0.06s', duration: '2.4s', rotate: '22deg', char: '♥' },
    { left: '31%', delay: '0.12s', duration: '2.1s', rotate: '-28deg', char: '✿' },
    { left: '46%', delay: '0.18s', duration: '2.5s', rotate: '18deg', char: '♥' },
    { left: '61%', delay: '0.04s', duration: '2.3s', rotate: '-16deg', char: '✿' },
    { left: '75%', delay: '0.1s', duration: '2.4s', rotate: '26deg', char: '♥' },
    { left: '88%', delay: '0.15s', duration: '2.2s', rotate: '-24deg', char: '✿' }
  ];

  return (
    <div
      className="home-petal-shower"
      aria-hidden="true"
    >
      {petals.map(
        (petal, index) => (
          <span
            key={index}
            className="home-petal"
            style={{
              left: petal.left,
              animationDelay: petal.delay,
              animationDuration: petal.duration,
              '--petal-rotate': petal.rotate
            }}
          >
            {petal.char}
          </span>
        )
      )}
    </div>
  );
}


function Home({ add }) {

  return (

    <main className="home-page">

      <HomePetalShower />


      {/* HERO */}

      <section className="hero">

        <div className="hero-copy">

          <div className="eyebrow">
            MADE FOR TWO
          </div>


          <h1>
            Give them a reason to
            <i>
              {' '}put the phones down.
            </i>
          </h1>


          <p className="hero-lead">

            INIYO turns an ordinary evening into a simple
            experience: light the candle, start a conversation,
            play a little, share a snack and leave one surprise
            for last.

          </p>


          <div className="hero-actions">

            <Link
              className="primary-btn"
              to="/product/1"
            >

              Shop the experience

              <span>
                →
              </span>

            </Link>


            <a
              className="text-link"
              href="#how"
            >
              See how it works ↓
            </a>

          </div>


          <div className="hero-trust">

            <span>
              ✓
            </span>

            Curated experience · Easy to start · Made for two

          </div>

        </div>


        <div className="hero-photo">

          <img
            src={HOME_IMAGE}
            alt="A couple enjoying an INIYO experience"
          />


          <div className="photo-caption">

            <b>
              A little plan for tonight.
            </b>

            <span>
              Talk · Play · Snack · Surprise
            </span>

          </div>

        </div>

      </section>


      {/* EXPERIENCE STRIP */}

      <section
        className="experience-strip"
      >

        <span>
          CONVERSATION
        </span>

        <b>·</b>

        <span>
          PLAY
        </span>

        <b>·</b>

        <span>
          SNACK
        </span>

        <b>·</b>

        <span>
          SURPRISE
        </span>

      </section>


      {/* HOW */}

      <section
        className="section how"
        id="how"
      >

        <div
          className="
            section-heading
            centered
          "
        >

          <div className="eyebrow">
            HOW THE EXPERIENCE FLOWS
          </div>


          <h2>

            One box.

            <br />

            <i>
              One evening, already planned.
            </i>

          </h2>


          <p>

            You don't need to plan a date, search for
            activities or figure out what to do next.
            INIYO gives you a simple flow, while the
            two of you make the moment your own.

          </p>

        </div>


        <div className="flow-grid">

          <FlowStep
            n="01"
            title="Set the mood"
            text="Open the box, light the scented candle and scan the QR to start the INIYO playlist."
          />

          <FlowStep
            n="02"
            title="Start talking"
            text="Take the conversation cards one at a time. Answer, listen, laugh and share."
          />

          <FlowStep
            n="03"
            title="Play together"
            text="Roll the dice, find the matching action and simply do what the game says."
          />

          <FlowStep
            n="04"
            title="Take a little break"
            text="Share the snack and chocolate while the music continues."
          />

          <FlowStep
            n="05"
            title="Leave one thing for last"
            text="When the evening feels right, open the final surprise envelope."
          />

          <FlowStep
            n="06"
            title="Make it yours"
            text="There is no perfect way to do it. Enjoy your own version of the night."
          />

        </div>

      </section>


      {/* PRODUCTS */}

      <section
        className="
          section
          product-carousel-section
        "
      >

        <div
          className="
            section-heading
            carousel-heading
          "
        >

          <div className="eyebrow">
            THE INIYO EXPERIENCE
          </div>


          <h2>
            Little things that make
            <br />
            <i>
              the moment matter.
            </i>
          </h2>


          <p>
            Explore the pieces inside the INIYO experience.
          </p>

        </div>


        <ProductCarousel
          products={PRODUCTS}
          add={add}
        />

      </section>


      {/* COMING SOON */}

      <section
        className="
          section
          coming-soon
        "
      >

        <div className="coming-card">

          <div>

            <div className="eyebrow">
              COMING SOON
            </div>


            <h2>
              Something for
              <i>
                {' '}siblings.
              </i>
            </h2>


            <p>
              A new experience for siblings is on the way —
              built around stories, games, inside jokes and
              time together.
            </p>


            <span className="coming-pill">
              SIBLINGS · LAUNCHING SOON
            </span>

          </div>


          <div className="coming-visual">

            <img
              src={SIBLING_IMAGE}
              alt="INIYO siblings experience coming soon"
            />

          </div>

        </div>

      </section>

    </main>
  );
}


/* =========================================================
   FLOW STEP
========================================================= */

function FlowStep({
  n,
  title,
  text
}) {

  return (

    <article className="flow-step">

      <div className="flow-step-content">

        <span>
          {n}
        </span>

        <h3>
          {title}
        </h3>

        <p>
          {text}
        </p>

      </div>

    </article>
  );
}


/* =========================================================
   SHOP
========================================================= */

function Shop({ add }) {

  return (

    <main className="page shop-page">

      <div className="eyebrow">
        SHOP
      </div>


      <h1>
        Choose your
        <i>
          {' '}experience.
        </i>
      </h1>


      <p className="page-intro">
        Start with the INIYO Couple Experience.
      </p>


      <div className="grid">

        {PRODUCTS.map(product => (

          <ProductCard
            key={product.id}
            p={product}
            add={add}
          />

        ))}

      </div>

    </main>
  );
}


/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductCard({
  p,
  add,
  featured = false,
  comingSoon = false
}) {

  const isComingSoon =
    comingSoon || p.comingSoon;

  return (

    <article
      className={`product-card ${
        featured ? 'featured' : ''
      } ${
        isComingSoon
          ? 'is-coming-soon'
          : ''
      }`}
    >

      {isComingSoon ? (

        <div
          className="product-image"
          aria-label={`${p.name} coming soon`}
        >

          <img
            src={p.imageUrl}
            alt={p.name}
          />

        </div>

      ) : (

        <Link
          className="product-image"
          to={`/product/${p.id}`}
        >

          <img
            src={p.imageUrl}
            alt={p.name}
          />

          <span>
            View product →
          </span>

        </Link>

      )}


      <div className="product-info">

        <div className="product-info-title">

          <small>
            {p.category}
          </small>

          <h3>
            {p.name}
          </h3>

        </div>


        <strong
          className={
            isComingSoon
              ? 'coming-price'
              : ''
          }
        >
          {isComingSoon
            ? 'Coming soon'
            : `₹${Number(
                p.price
              ).toLocaleString('en-IN')}`}
        </strong>


        <p>
          {p.description}
        </p>


        {isComingSoon ? (

          <button
            className="
              primary-btn
              small-btn
              coming-soon-btn
            "
            type="button"
            disabled
          >
            Coming soon
          </button>

        ) : (

          <button
            className="
              primary-btn
              small-btn
            "
            onClick={() =>
              add(p)
            }
          >
            Add to bag

            <span>
              +
            </span>

          </button>

        )}

      </div>

    </article>
  );
}


/* =========================================================
   PRODUCT
========================================================= */

function Product({ add }) {

  const { id } =
    useParams();


  const [product, setProduct] =
    useState(null);


  const [activeImage, setActiveImage] =
    useState(0);


  useEffect(() => {

    const localProduct =
      PRODUCTS.find(
        p =>
          String(p.id) ===
          String(id)
      );


    if (localProduct) {

      setProduct(
        localProduct
      );

      return;
    }


    fetch(
      `${API}/products/${id}`
    )

      .then(response =>
        response.json()
      )

      .then(data => {

        setProduct({
          ...data,

          price:
            FIXED_PRICE,

          imageUrl:
            PRODUCT_IMAGES[0]
        });

      })

      .catch(() => {

        setProduct(
          DEMO_PRODUCT
        );

      });

  }, [id]);


  const images = useMemo(() => {

    if (
      String(id) === '1'
    ) {

      return PRODUCT_IMAGES;

    }


    return [
      product?.imageUrl
    ].filter(Boolean);

  }, [id, product]);


  if (!product) {

    return (

      <main className="page loading">

        Loading product...

      </main>

    );
  }


  return (

    <main className="product-page">


      {/* GALLERY */}

      <div className="product-gallery">

        <div className="gallery-main">

          <img
            src={images[activeImage]}
            alt={product.name}
          />


          <button
            className="
              gallery-arrow
              left
            "
            onClick={() =>
              setActiveImage(
                current =>
                  (
                    current -
                    1 +
                    images.length
                  ) %
                  images.length
              )
            }
          >
            ‹
          </button>


          <button
            className="
              gallery-arrow
              right
            "
            onClick={() =>
              setActiveImage(
                current =>
                  (
                    current + 1
                  ) %
                  images.length
              )
            }
          >
            ›
          </button>


          <div className="gallery-count">
            {activeImage + 1}
            {' / '}
            {images.length}
          </div>

        </div>


        <div className="gallery-thumbs">

          {images.map(
            (image, index) => (

              <button
                key={image}
                className={
                  index === activeImage
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setActiveImage(
                    index
                  )
                }
              >

                <img
                  src={image}
                  alt=""
                />

              </button>

            )
          )}

        </div>

      </div>


      {/* DETAILS */}

      <div className="product-details">

        <div className="eyebrow">

          {product.category}
          {' · EXPERIENCE BOX'}

        </div>


        <h1>
          {product.name}
        </h1>


        <div className="price">

          ₹{Number(
            product.price
          ).toLocaleString('en-IN')}

        </div>


        <p className="product-description">
          {product.description}
        </p>


        <div className="buy-points">

          <span>
            ✓ Experience designed for two
          </span>

          <span>
            ✓ Guided from first step to final surprise
          </span>

          <span>
            ✓ One box, no complicated planning
          </span>

        </div>


        <div className="included">

          <h3>
            What the experience includes
          </h3>


          <div className="included-grid">

            <span>
              Conversation cards
            </span>

            <span>
              Scented candle
            </span>

            <span>
              Couples dice game
            </span>

            <span>
              Snack & chocolate
            </span>

            <span>
              Playlist QR
            </span>

            <span>
              Final surprise envelope
            </span>

          </div>

        </div>


        <button
          className="
            primary-btn
            buy-btn
          "
          onClick={() =>
            add(product)
          }
        >

          Add to bag

          <span>
            →
          </span>

        </button>


        <div className="product-note">
          Secure checkout · Easy ordering · Delivery details
          shown before payment
        </div>

      </div>


      {/* MOBILE BUY */}

      <div className="mobile-buy">

        <span>
          ₹{Number(
            product.price
          ).toLocaleString('en-IN')}
        </span>


        <button
          className="primary-btn"
          onClick={() =>
            add(product)
          }
        >
          Add to bag →
        </button>

      </div>

    </main>
  );
}


/* =========================================================
   CART
========================================================= */

function Cart({
  cart,
  setCart,
  user,
  onPaymentStart
}) {

  const navigate =
    useNavigate();


  const total =
    cart.reduce(
      (sum, item) =>
        sum +
        Number(item.price) *
        item.quantity,
      0
    );


  const updateQuantity = (
    id,
    quantity
  ) => {

    setCart(
      cart.map(item =>

        item.id === id

          ? {
              ...item,

              quantity:
                Math.max(
                  1,
                  quantity
                )
            }

          : item

      )
    );

  };


  const removeItem = id => {

    setCart(
      cart.filter(
        item =>
          item.id !== id
      )
    );

  };


  const buy = async () => {

    if (!user) {

      navigate('/login');

      return;
    }


    if (!cart.length) {
      return;
    }


    try {

      onPaymentStart?.();

      const response =
        await fetch(
          `${API}/orders`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${user.token}`
            },

            body:
              JSON.stringify({

                paymentMethod:
                  'UPI',

                items:
                  cart.map(
                    item => ({

                      productId:
                        item.id,

                      quantity:
                        item.quantity

                    })
                  )

              })
          }
        );


      if (
        response.status === 401
      ) {

        localStorage.removeItem(
          'user'
        );

        navigate('/login');

        return;
      }


      if (!response.ok) {

        const data =
          await response
            .json()
            .catch(() => ({}));

        alert(
          data.message ||
          'Could not place order'
        );

        return;
      }


      setCart([]);

      navigate('/orders');

    } catch (error) {

      console.error(
        error
      );

      alert(
        'Unable to place order. Please try again.'
      );

    }

  };


  return (

    <main
      className="
        page
        cart-page
      "
    >

      <div className="eyebrow">
        YOUR BAG
      </div>


      <h1>
        Ready for a
        <i>
          {' '}better evening?
        </i>
      </h1>


      {!cart.length ? (

        <div className="empty">

          <div>
            ♡
          </div>


          <p>
            Your bag is waiting.
          </p>


          <Link
            className="primary-btn"
            to="/shop"
          >
            Explore INIYO →
          </Link>

        </div>

      ) : (

        <div className="cart-layout">


          {/* ITEMS */}

          <div>

            {cart.map(item => (

              <div
                className="cart-row"
                key={item.id}
              >

                <img
                  src={
                    item.imageUrl
                  }
                  alt={
                    item.name
                  }
                />


                <div
                  className="cart-main"
                >

                  <small>
                    {item.category}
                  </small>


                  <h3>
                    {item.name}
                  </h3>


                  <b>
                    ₹{Number(
                      item.price
                    ).toLocaleString(
                      'en-IN'
                    )}
                  </b>


                  <div className="qty">

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity - 1
                        )
                      }
                    >
                      −
                    </button>


                    <span>
                      {item.quantity}
                    </span>


                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>


                    <button
                      className="remove"
                      onClick={() =>
                        removeItem(
                          item.id
                        )
                      }
                    >
                      Remove
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>


          {/* SUMMARY */}

          <aside
            className="summary"
          >

            <div className="eyebrow">
              ORDER SUMMARY
            </div>


            <h3>
              Your experience starts here.
            </h3>


            <div>

              <span>
                Subtotal
              </span>

              <b>
                ₹{total.toLocaleString(
                  'en-IN'
                )}
              </b>

            </div>


            <div>

              <span>
                Delivery
              </span>

              <span>
                Shown at checkout
              </span>

            </div>


            <hr />


            <div className="total">

              <span>
                Total
              </span>

              <strong>
                ₹{total.toLocaleString(
                  'en-IN'
                )}
              </strong>

            </div>


            <button
              className="primary-btn"
              onClick={buy}
            >
              Continue to payment →
            </button>

          </aside>

        </div>

      )}

    </main>
  );
}


/* =========================================================
   AUTH
   NAME + PHONE + EMAIL + OTP
========================================================= */

function Auth({
  setUser
}) {

  const navigate =
    useNavigate();


  const [step, setStep] =
    useState('details');


  const [name, setName] =
    useState('');


  const [phone, setPhone] =
    useState('');


  const [email, setEmail] =
    useState('');


  const [otp, setOtp] =
    useState('');


  const [loading, setLoading] =
    useState(false);


  const [error, setError] =
    useState('');


  const [message, setMessage] =
    useState('');


  const [resendSeconds, setResendSeconds] =
    useState(0);


  /* =======================================================
     RESEND TIMER
  ======================================================= */

  useEffect(() => {

    if (
      resendSeconds <= 0
    ) {
      return;
    }


    const timer =
      window.setInterval(
        () => {

          setResendSeconds(
            current =>
              current > 0
                ? current - 1
                : 0
          );

        },
        1000
      );


    return () =>
      window.clearInterval(
        timer
      );

  }, [resendSeconds]);


  /* =======================================================
     SEND OTP
  ======================================================= */

  const sendOtp = async (
    event
  ) => {

    event?.preventDefault();


    setError('');
    setMessage('');


    const cleanName =
      name.trim();


    const cleanPhone =
      phone.trim();


    const cleanEmail =
      email
        .trim()
        .toLowerCase();


    if (
      cleanName.length < 2
    ) {

      setError(
        'Please enter your name.'
      );

      return;
    }


    if (
      !/^[6-9][0-9]{9}$/.test(
        cleanPhone
      )
    ) {

      setError(
        'Please enter a valid 10-digit phone number.'
      );

      return;
    }


    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        cleanEmail
      )
    ) {

      setError(
        'Please enter a valid email address.'
      );

      return;
    }


    setLoading(true);


    try {

      const response =
        await fetch(
          `${API}/auth/send-otp`,
          {
            method:
              'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body:
              JSON.stringify({

                name:
                  cleanName,

                phone:
                  cleanPhone,

                email:
                  cleanEmail

              })
          }
        );


      const data =
        await response
          .json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          'Unable to send OTP.'
        );
      }


      setEmail(
        cleanEmail
      );

      setStep('otp');

      setOtp('');

      setResendSeconds(
        60
      );

      setMessage(
        `OTP sent to ${cleanEmail}`
      );

    } catch (error) {

      setError(
        error.message ||
        'Unable to send OTP.'
      );

    } finally {

      setLoading(false);
    }

  };


  /* =======================================================
     VERIFY OTP
  ======================================================= */

  const verifyOtp = async (
    event
  ) => {

    event.preventDefault();


    setError('');
    setMessage('');


    const cleanOtp =
      otp.trim();


    if (
      !/^\d{6}$/.test(
        cleanOtp
      )
    ) {

      setError(
        'Please enter the 6-digit OTP.'
      );

      return;
    }


    setLoading(true);


    try {

      const response =
        await fetch(
          `${API}/auth/verify-otp`,
          {
            method:
              'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body:
              JSON.stringify({

                name:
                  name.trim(),

                phone:
                  phone.trim(),

                email:
                  email
                    .trim()
                    .toLowerCase(),

                otp:
                  cleanOtp

              })
          }
        );


      const data =
        await response
          .json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          'Invalid OTP.'
        );
      }


      /* SAVE USER */

      localStorage.setItem(
        'user',
        JSON.stringify(
          data
        )
      );


      /* UPDATE APP */

      setUser(
        data
      );


      /* HOME */

      navigate('/');

    } catch (error) {

      setError(
        error.message ||
        'Unable to verify OTP.'
      );

    } finally {

      setLoading(false);
    }

  };


  /* =======================================================
     RESEND
  ======================================================= */

  const resendOtp = async () => {

    if (
      resendSeconds > 0 ||
      loading
    ) {
      return;
    }


    await sendOtp();

  };


  /* =======================================================
     BACK
  ======================================================= */

  const changeDetails = () => {

    setStep(
      'details'
    );

    setOtp('');

    setError('');

    setMessage('');

    setResendSeconds(
      0
    );

  };


  /* =======================================================
     UI
  ======================================================= */

  return (

    <main
      className="auth-page"
    >


      {/* LEFT SIDE */}

      <div className="auth-art">

        <div className="auth-quote">

          Less scrolling.

          <br />

          <i>
            More being together.
          </i>

        </div>


        <span>
          iniyo ♥
        </span>

      </div>


      {/* FORM */}

      <div className="auth-form">

        <div className="eyebrow">
          WELCOME TO INIYO
        </div>


        {step === 'details' ? (

          <>

            <h1>
              Make moments
              <i>
                {' '}meaningful.
              </i>
            </h1>


            <p>
              Enter your details and we'll
              send a secure verification code
              to your email.
            </p>


            <form
              onSubmit={
                sendOtp
              }
            >


              {/* NAME */}

              <input
                type="text"
                placeholder="Full name"
                value={name}
                required
                autoComplete="name"
                onChange={event => {

                  setName(
                    event.target.value
                  );

                  setError('');

                }}
              />


              {/* PHONE */}

              <input
                type="tel"
                placeholder="Phone number"
                value={phone}
                required
                maxLength={10}
                autoComplete="tel"
                onChange={event => {

                  setPhone(
                    event.target.value
                      .replace(
                        /\D/g,
                        ''
                      )
                      .slice(
                        0,
                        10
                      )
                  );

                  setError('');

                }}
              />


              {/* EMAIL */}

              <input
                type="email"
                placeholder="Email address"
                value={email}
                required
                autoComplete="email"
                onChange={event => {

                  setEmail(
                    event.target.value
                  );

                  setError('');

                }}
              />


              {/* ERROR */}

              {error && (

                <div
                  className="auth-error"
                >
                  {error}
                </div>

              )}


              {/* SEND */}

              <button
                type="submit"
                className="primary-btn"
                disabled={loading}
              >

                {loading
                  ? 'Sending OTP...'
                  : 'Send OTP'}

                {!loading && (
                  <span>
                    →
                  </span>
                )}

              </button>

            </form>

          </>

        ) : (

          <>

            <h1>
              Check your
              <i>
                {' '}inbox.
              </i>
            </h1>


            <p>

              We sent a 6-digit
              verification code to

              <strong>
                {' '}
                {email}
              </strong>

            </p>


            <form
              onSubmit={
                verifyOtp
              }
            >


              {/* OTP */}

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                value={otp}
                autoComplete="one-time-code"
                autoFocus
                onChange={event => {

                  setOtp(
                    event.target.value
                      .replace(
                        /\D/g,
                        ''
                      )
                      .slice(
                        0,
                        6
                      )
                  );

                  setError('');

                }}
              />


              {/* ERROR */}

              {error && (

                <div
                  className="auth-error"
                >
                  {error}
                </div>

              )}


              {/* SUCCESS */}

              {message && (

                <div
                  className="auth-success"
                >
                  {message}
                </div>

              )}


              {/* VERIFY */}

              <button
                type="submit"
                className="primary-btn"
                disabled={loading}
              >

                {loading
                  ? 'Verifying...'
                  : 'Verify & Continue'}

                {!loading && (
                  <span>
                    →
                  </span>
                )}

              </button>


              {/* RESEND */}

              <div
                className="otp-resend"
              >

                {resendSeconds > 0 ? (

                  <span>
                    Resend OTP in {resendSeconds}s
                  </span>

                ) : (

                  <button
                    type="button"
                    onClick={
                      resendOtp
                    }
                    disabled={loading}
                  >
                    Resend OTP
                  </button>

                )}

              </div>


              {/* CHANGE DETAILS */}

              <button
                type="button"
                className="auth-back"
                onClick={
                  changeDetails
                }
              >
                ← Change details
              </button>

            </form>

          </>

        )}

      </div>

    </main>
  );
}


/* =========================================================
   PROFILE
========================================================= */

function Profile({
  user,
  setUser
}) {

  const navigate =
    useNavigate();


  const [profile, setProfile] =
    useState(null);


  const [name, setName] =
    useState('');


  const [phone, setPhone] =
    useState('');


  const [editing, setEditing] =
    useState(false);


  const [loading, setLoading] =
    useState(true);


  const [saving, setSaving] =
    useState(false);


  const [error, setError] =
    useState('');


  const [success, setSuccess] =
    useState('');


  /* =======================================================
     LOAD
  ======================================================= */

  useEffect(() => {

    if (!user?.token) {

      navigate(
        '/login'
      );

      return;
    }


    loadProfile();

  }, []);


  const loadProfile =
    async () => {

      try {

        const response =
          await fetch(
            `${API}/auth/me`,
            {
              headers: {
                Authorization:
                  `Bearer ${user.token}`
              }
            }
          );


        if (
          response.status ===
          401
        ) {

          localStorage.removeItem(
            'user'
          );

          setUser(null);

          navigate(
            '/login'
          );

          return;
        }


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            'Unable to load profile.'
          );
        }


        setProfile(
          data
        );

        setName(
          data.name || ''
        );

        setPhone(
          data.phone || ''
        );

      } catch (error) {

        setError(
          error.message ||
          'Unable to load profile.'
        );

      } finally {

        setLoading(
          false
        );
      }

    };


  /* =======================================================
     SAVE
  ======================================================= */

  const saveProfile =
    async () => {

      setError('');

      setSuccess('');


      if (
        name.trim().length < 2
      ) {

        setError(
          'Please enter a valid name.'
        );

        return;
      }


      if (
        !/^[6-9][0-9]{9}$/.test(
          phone
        )
      ) {

        setError(
          'Please enter a valid 10-digit phone number.'
        );

        return;
      }


      try {

        setSaving(
          true
        );


        const response =
          await fetch(
            `${API}/auth/me`,
            {
              method:
                'PUT',

              headers: {

                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${user.token}`

              },

              body:
                JSON.stringify({

                  name:
                    name.trim(),

                  phone:
                    phone.trim()

                })
            }
          );


        const data =
          await response
            .json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            'Unable to update profile.'
          );
        }


        setProfile(
          data
        );


        const updatedUser = {

          ...user,

          name:
            data.name,

          email:
            data.email,

          phone:
            data.phone,

          emailVerified:
            data.emailVerified

        };


        localStorage.setItem(
          'user',
          JSON.stringify(
            updatedUser
          )
        );


        setUser(
          updatedUser
        );


        setEditing(
          false
        );


        setSuccess(
          'Profile updated successfully.'
        );

      } catch (error) {

        setError(
          error.message ||
          'Unable to update profile.'
        );

      } finally {

        setSaving(
          false
        );
      }

    };


  /* =======================================================
     LOGOUT
  ======================================================= */

  const logout =
    () => {

      localStorage.removeItem(
        'user'
      );

      setUser(
        null
      );

      navigate(
        '/'
      );

    };


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {

    return (

      <main className="profile-page">

        <div className="profile-card">

          Loading profile...

        </div>

      </main>
    );
  }


  /* =======================================================
     PROFILE
  ======================================================= */

  return (

    <main
      className="profile-page"
    >

      <div
        className="profile-card"
      >


        {/* HEADER */}

        <div
          className="profile-header"
        >

          <div
            className="profile-avatar"
          >

            {(profile?.name || 'U')
              .charAt(0)
              .toUpperCase()}

          </div>


          <div>

            <h1>
              My Profile
            </h1>

            <p>
              Manage your INIYO account
            </p>

          </div>

        </div>


        {/* ERROR */}

        {error && (

          <div
            className="auth-error"
          >
            {error}
          </div>

        )}


        {/* SUCCESS */}

        {success && (

          <div
            className="auth-success"
          >
            {success}
          </div>

        )}


        {/* FIELDS */}

        <div
          className="profile-fields"
        >


          {/* NAME */}

          <div
            className="profile-field"
          >

            <label>
              Name
            </label>


            {editing ? (

              <input
                type="text"
                value={name}
                onChange={event =>
                  setName(
                    event.target.value
                  )
                }
              />

            ) : (

              <span>
                {profile?.name}
              </span>

            )}

          </div>


          {/* EMAIL */}

          <div
            className="profile-field"
          >

            <label>
              Email
            </label>


            <div
              className="profile-email"
            >

              <span>
                {profile?.email}
              </span>


              {profile?.emailVerified && (

                <small
                  className="verified"
                >
                  ✓ Verified
                </small>

              )}

            </div>

          </div>


          {/* PHONE */}

          <div
            className="profile-field"
          >

            <label>
              Phone
            </label>


            {editing ? (

              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={event =>
                  setPhone(
                    event.target.value
                      .replace(
                        /\D/g,
                        ''
                      )
                  )
                }
              />

            ) : (

              <span>
                {profile?.phone}
              </span>

            )}

          </div>

        </div>


        {/* ACTIONS */}

        <div
          className="profile-actions"
        >

          {editing ? (

            <>

              <button
                onClick={
                  saveProfile
                }
                disabled={saving}
              >

                {saving
                  ? 'Saving...'
                  : 'Save Changes'}

              </button>


              <button
                className="secondary"
                onClick={() => {

                  setEditing(
                    false
                  );

                  setName(
                    profile?.name || ''
                  );

                  setPhone(
                    profile?.phone || ''
                  );

                  setError('');

                }}
              >
                Cancel
              </button>

            </>

          ) : (

            <button
              onClick={() => {

                setEditing(
                  true
                );

                setSuccess('');

              }}
            >
              Edit Profile
            </button>

          )}

        </div>


        {/* LINKS */}

        <div
          className="profile-links"
        >

          <button
            onClick={() =>
              navigate(
                '/orders'
              )
            }
          >
            My Orders
          </button>


          <button
            className="logout-button"
            onClick={
              logout
            }
          >
            Logout
          </button>

        </div>

      </div>

    </main>
  );
}


/* =========================================================
   ORDERS
========================================================= */

function Orders({
  user
}) {

  const [orders, setOrders] =
    useState([]);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState('');


  useEffect(() => {

    if (!user?.token) {

      setLoading(
        false
      );

      return;
    }


    fetch(
      `${API}/orders`,
      {
        headers: {

          Authorization:
            `Bearer ${user.token}`

        }
      }
    )

      .then(async response => {

        if (
          response.status ===
          401
        ) {

          throw new Error(
            'SESSION_EXPIRED'
          );
        }


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            'Unable to load orders.'
          );
        }


        return data;

      })

      .then(data => {

        setOrders(
          Array.isArray(data)
            ? data
            : []
        );

      })

      .catch(error => {

        if (
          error.message ===
          'SESSION_EXPIRED'
        ) {

          setError(
            'Your session has expired. Please login again.'
          );

        } else {

          setError(
            error.message ||
            'Unable to load orders.'
          );

        }

      })

      .finally(() => {

        setLoading(
          false
        );

      });

  }, [user]);


  if (!user) {

    return (

      <main className="page">

        <h1>
          Please login.
        </h1>

        <Link
          className="primary-btn"
          to="/login"
        >
          Login →
        </Link>

      </main>
    );
  }


  if (loading) {

    return (

      <main className="page">

        <h1>
          Your orders
        </h1>

        <p>
          Loading...
        </p>

      </main>
    );
  }


  return (

    <main
      className="
        page
        orders-page
      "
    >

      <div className="eyebrow">
        YOUR ORDERS
      </div>


      <h1>

        Moments on their

        <i>
          {' '}way to you.
        </i>

      </h1>


      {error && (

        <div
          className="auth-error"
        >
          {error}
        </div>

      )}


      {!orders.length ? (

        <div className="empty">

          <div>
            ♥
          </div>


          <p>
            No orders yet.
          </p>


          <Link
            className="primary-btn"
            to="/shop"
          >
            Shop INIYO →
          </Link>

        </div>

      ) : (

        <div>

          {orders.map(
            order => (

              <div
                className="order-card"
                key={order.id}
              >

                <div>

                  <small>
                    ORDER #{order.id}
                  </small>


                  <h3>
                    {order.status}
                  </h3>

                </div>


                <strong>
                  ₹{Number(
                    order.total || 0
                  ).toLocaleString(
                    'en-IN'
                  )}
                </strong>


                {order.items && (

                  <p>

                    {order.items
                      .map(
                        item =>
                          `${item.productName || 'Product'} × ${item.quantity}`
                      )
                      .join(', ')}

                  </p>

                )}

              </div>

            )
          )}

        </div>

      )}

    </main>
  );
}


/* =========================================================
   CREATE ROOT
========================================================= */

createRoot(
  document.getElementById('root')
).render(

  <BrowserRouter>

    <App />

  </BrowserRouter>

);
ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
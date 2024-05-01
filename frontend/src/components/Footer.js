import React from "react";
import Logo from './assets/logo.png';
export default function Footer() {
  return (
    <div>


      <div
        style={{
          backgroundColor: "#081F3C",
          color: "white",
          bottom: "0",
          width: "100%",
        }}
      >
        <div class="container">
          <footer class="py-5">
            <div class="row">
              <div class="col-6 col-md-2 mb-3">
                <ul class="nav flex-column">
                  <a href="/">
                    <img
                      src={Logo}
                      alt=""
                      width="150"
                      height="45"
                      class="d-inline-block align-text-top"
                    />
                  </a>
                  <br />
                  <i
                    class="fab fa-facebook-f mt-2 "
                    aria-hidden="true"
                    style={{ fontSize: "19px" }}
                  ></i>
                  <i class="fab fa-twitter mt-2 " aria-hidden="true"></i>
                  <i class="fab fa-linkedin mt-2 " aria-hidden="true"></i>
                  <i class="fab fa-youtube mt-2 " aria-hidden="true"></i>
                </ul>
              </div>

              <div class="col-6 col-md-2 mb-3">
                <h5>Section</h5>
                <ul class="nav flex-column">
                  <li class="nav-item mb-2">
                    <a href="/" class="nav-link p-0 text-muted">
                      Home
                    </a>
                  </li>
                  <li class="nav-item mb-2">
                    <a href="/tickets" class="nav-link p-0 text-muted">
                      Help
                    </a>
                  </li>
                  <li class="nav-item mb-2">
                    <a href="/feedback" class="nav-link p-0 text-muted">
                      Feedback
                    </a>
                  </li>
                  <li class="nav-item mb-2">
                    <a href="/faq" class="nav-link p-0 text-muted">
                      FAQs
                    </a>
                  </li>
                  <li class="nav-item mb-2">
                    <a href="/about" class="nav-link p-0 text-muted">
                      About Us
                    </a>
                  </li>
                </ul>
              </div>

              <div class="col-6 col-md-2 mb-3">
                <h5>Section</h5>
                <ul class="nav flex-column">
                  <li class="nav-item mb-2">
                    <a href="#" class="nav-link p-0 text-muted">
                      Earth
                    </a>
                  </li>
                  <li class="nav-item mb-2">
                    <a href="/newsfeed" class="nav-link p-0 text-muted">
                     Mars
                    </a>
                  </li>
                  <li class="nav-item mb-2">
                    <a href="#" class="nav-link p-0 text-muted">
                      APIs
                    </a>
                  </li>
                  <li class="nav-item mb-2">
                    <a href="#" class="nav-link p-0 text-muted">
                      Terms & Conditions
                    </a>
                  </li>

                  <li class="nav-item mb-2">
                    <a href="/register" class="nav-link p-0 text-muted">
                      Sign Up
                    </a>
                  </li>
                </ul>
              </div>

              <div class="col-md-5 offset-md-1 mb-3">
                <form>
                  <h5>Subscribe to our newsletter</h5>
                  <p>Monthly digest of what's new and exciting from us.</p>
                  <div class="d-flex flex-column flex-sm-row w-100 gap-2">
                    <label for="newsletter1" class="visually-hidden">
                      Email address
                    </label>
                    <input
                      id="newsletter1"
                      type="text"
                      class="form-control"
                      placeholder="Email address"
                    />
                    <button class="btn" type="button">
                      Subscribe
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div>
              <hr />
              <p className="text-end">
                © 2024 AstroInsight Inc. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

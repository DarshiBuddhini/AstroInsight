import React from "react";
import backgroundImage from "../components/assets/space.jpg";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Homescreen() {
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div
        className="row justify-content-center"
        style={{ paddingTop: "120px" }}
      >
        <Grid container spacing={2} columns={16}>
          <Grid item xs={15}>
            <Typography
              variant="h3"
              marginLeft={20}
              marginRight={10}
              gutterBottom
              style={{ color: "#fff" }}
            >
              AstroInsight: Unveiling the Mysteries of the Universe
            </Typography>
            <br/>
            <Typography
              variant="h6"
              marginLeft={20}
              gutterBottom
              style={{ color: "#fff" }}
            >
              AstroInsight is your gateway to the cosmos, offering a captivating
              journey through space exploration and celestial wonders. Dive into
              the Astronomy Picture of the Day to witness breathtaking cosmic
              phenomena, explore Mars Rover Photos for glimpses of the Red
              Planet's surface, track asteroids with NeoWs data, and delve into
              Earth's environmental dynamics with NASA Earth API.
            </Typography>
          </Grid>
          <Grid item xs={1}>
            
          </Grid>
        </Grid>

        {/* <div className="flex-container shadow p-0 bg-white rounded justify-content-center"> */}
        {/* <div className="col-md-9  shadow-lg p-0 mb-5 bg-white rounded">
          <div
            id="carouselExampleCaptions"
            class="carousel slide"
            data-bs-ride="carousel"
          >
            <div class="carousel-indicators">
              <button
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide-to="0"
                class="active"
                aria-current="true"
                aria-label="Slide 1"
              ></button>

              <button
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide-to="2"
                aria-label="Slide 3"
              ></button>
            </div>
            <div class="carousel-inner">
              <div class="carousel-item active">
                <img
                  src="https://static.wixstatic.com/media/618c8c_31ca956333354ac4990f5e28bbc6114f~mv2.png"
                  className="d-block w-100"
                  alt="..."
                />
                <div class="carousel-caption d-none d-md-block">
                  <h5 className="svg-shadow-xs">First slide label</h5>
                  <p>
                    Some representative placeholder content for the first slide.
                  </p>
                </div>
              </div>

              <div class="carousel-item">
                <img
                  src="https://static.wixstatic.com/media/618c8c_31ca956333354ac4990f5e28bbc6114f~mv2.png"
                  className="d-block w-100"
                  alt="..."
                />
                <div class="carousel-caption d-none d-md-block">
                  <h5>Third slide label</h5>
                  <p>
                    Some representative placeholder content for the third slide.
                  </p>
                </div>
              </div>
            </div>
            <button
              class="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide="prev"
            >
              <span
                class="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button
              class="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide="next"
            >
              <span
                class="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div> */}

        <div>
          <div class="container p-5">
            <div class="container" style={{ paddingTop: "20px" }}>
              <div class="row justify-content-center">
                <div
                  className="col-sm-12 col-md-3"
                  style={{ paddingTop: "20px" }}
                >
                  <div className="card card shadow p-0 bg-white rounded justify-content-center">
                    <img
                      src="https://img.freepik.com/premium-photo/astronaut-elements-this-image_46383-20722.jpg?w=360"
                      className="card-img-top"
                      alt="..."
                    />
                    <div className="card-body">
                      <br />
                      <h4 className="card-title">
                        Astronomy Picture of the Day
                      </h4>
                      <br />
                      <p
                        className="card-text text-muted"
                        style={{ fontSize: "smaller" }}
                      >
                        APOD along with its associated metadata, such as the
                        title, date, explanation, and HD image link.
                      </p>
                    </div>

                    <div className="card-body">
                      <a href="/apod">
                        <button
                          className="btn rounded-circle shadow-lg"
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "60px",
                          }}
                        >
                          <i
                            className="fa fa-arrow-right"
                            style={{ fontSize: "25px" }}
                          ></i>
                        </button>
                      </a>
                    </div>
                  </div>
                </div>

                <div
                  className="col-sm-12 col-md-3"
                  style={{ paddingTop: "20px" }}
                >
                  <div className="card card shadow p-0 bg-white rounded justify-content-center">
                    <img
                      src="https://cdn.pixabay.com/photo/2019/04/06/06/44/astronaut-4106766_1280.jpg"
                      className="card-img-top"
                      alt="..."
                    />
                    <div className="card-body">
                      <br />
                      <h4 className="card-title">Mars Rover Photos</h4>
                      <br />
                      <p
                        className="card-text text-muted"
                        style={{ fontSize: "smaller" }}
                      >
                        Mars rover captured this 360-degree panorama using its
                        black-and-. Curiosity's Navcams View the Area Around
                        'Sequoia'.{" "}
                      </p>
                    </div>

                    <div className="card-body">
                      <a href="/mars">
                        <button
                          className="btn rounded-circle shadow-lg"
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "60px",
                          }}
                        >
                          <i
                            className="fa fa-arrow-right"
                            style={{ fontSize: "25px" }}
                          ></i>
                        </button>
                      </a>
                    </div>
                  </div>
                </div>

                <div
                  className="col-sm-12 col-md-3"
                  style={{ paddingTop: "20px" }}
                >
                  <div className="card card shadow p-0 bg-white rounded justify-content-center">
                    <img
                      src="https://cdn.pixabay.com/photo/2015/08/29/13/23/night-913046_640.jpg"
                      className="card-img-top"
                      alt="..."
                    />
                    <div className="card-body">
                      <br />
                      <h4 className="card-title">Asteroids - NeoWs</h4>

                      <p
                        className="card-text text-muted"
                        style={{ fontSize: "smaller" }}
                      >
                        NeoWs (Near Earth Object Web Service) is a RESTful web
                        service for near earth Asteroid information.
                      </p>
                    </div>

                    <div className="card-body">
                      <a href="/epic">
                        <button
                          className="btn rounded-circle shadow-lg"
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "60px",
                          }}
                        >
                          <i
                            className="fa fa-arrow-right"
                            style={{ fontSize: "25px" }}
                          ></i>
                        </button>
                      </a>
                    </div>
                  </div>
                </div>

                <div class="col-sm-12 col-md-3" style={{ paddingTop: "20px" }}>
                  <div class="card card shadow p-0 bg-white rounded justify-content-center">
                    <img
                      src="https://cdn.pixabay.com/photo/2016/10/30/20/46/universe-1784292_640.jpg"
                      class="card-img-top"
                      alt="..."
                    />
                    <div class="card-body">
                      <br />
                      <h4 class="card-title">NASA Earth API</h4>

                      <p
                        class="card-text text-muted"
                        style={{ fontSize: "smaller" }}
                      >
                        The images.nasa.gov API is organized around REST, has
                        resource­-oriented URLs and uses HTTP response codes to
                        indicate API errors.
                      </p>
                    </div>

                    <div class="card-body">
                      <a href="/earth">
                        <button
                          className="btn rounded-circle shadow-lg"
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "60px",
                          }}
                        >
                          <i
                            className="fa fa-arrow-right"
                            style={{ fontSize: "25px" }}
                          ></i>
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  className="d-flex justify-content-center"
                  style={{ paddingTop: "80px" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}

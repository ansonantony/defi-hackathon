import React from "react";

const App = () => {
  return <section className="medium-padding120 responsive-align-center">
    <div className="container">
      <div className="row">
        <div className="col-lg-6 col-md-12
        col-sm-12 col-xs-12">
          <header className="crumina-module
          crumina-heading heading--h2 
          heading--with-decoration">
            <div className="heading-sup-title">
              Top-5 Cryptocurrency
            </div>
            <h2 className="heading-title
            weight-normal">
              Statistic of Currency on <span className="weight-bold">all
               your devices</span>
            </h2>
            <div className="heading-text">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur nobis minima sapiente nostrum esse quidem deleniti earum consectetur, quam facere ullam alias quas optio dolorum numquam accusamus. Dicta, minus aut?
            </div>
          </header>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa autem fuga aut voluptatibus, temporibus dolorum explicabo distinctio excepturi ducimus at minus, praesentium cumque ipsa aliquid nobis, veritatis deserunt. Repudiandae, pariatur?</p>
          <div className="btn-market-wrap mt60">
            <a href="#"  className="btn btn--market btn--apple btn--with-icon
            btn--icon-left">
              <svg className="woox-icon
              icon-apple">
                <use xlinkHref="#icon-apple">

                </use>
              </svg>
              <div className="text">
                <span className="sup-title">
                  download on

                </span>
                <span className="title">
                  Apple Store
                  </span>
              </div>
            </a>
            <a href="#"  className="btn btn--market btn--apple btn--with-icon
            btn--icon-left">
              <svg className="woox-icon
              icon-if-59-play-843782">
                <use xlinkHref="#icon-if-59-play-843782">

                </use>
              </svg>
              <div className="text">
                <span className="sup-title">
                  download on

                </span>
                <span className="title">
                  Google Play
                  </span>
              </div>
            </a>
          </div>
        </div>

        <div className="col-lg-6 col-md-12
        col-sm-12 col-xs-12 mt30">
          <img className="responsive-width-50"
           src="img/phones.png" alt=""/>
        </div>
      </div>

    </div>
  </section>
};

export default App;

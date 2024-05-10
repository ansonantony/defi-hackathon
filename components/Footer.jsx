import React from "react";
import {TiSocialPinterestCircular,TiSocialYoutube,TiSocialInstagram,TiSocialTwitter,TiSocialFacebook} from "react-icons/ti"
import {FooterICON} from './index';


const Footer = () => {

  const social = [
    {
      link:"#",
      name:"Facebook",
      icon:<TiSocialFacebook/>,
    },
    {
      link:"#",
      name:"Twitter",
      icon:<TiSocialTwitter/>,
    },
    {
      link:"#",
      name:"Instagram",
      icon:<TiSocialInstagram/>,
    },
    {
      link:"#",
      name:"Facebook",
      icon:<TiSocialFacebook/>,
    },
    {
      link:"#",
      name:"Pintrest",
      icon:<TiSocialPinterestCircular/>,
    },
  ]
  return <footer className="footer" id="site-footer">F
    <canvas id="can">
      <div className="container">
          <div className="row">
            <div className="col-lg-6 col-lg-offset-3 col-md-6
            col-md-offset-3 col-sm-12 col-sm-offset-0 col-xs-12
            ">
              <div className="widget w-info">
                <a href="/" className="site-logo">
                  <img src="img/logo-primary.png" alt="" />
                  <FooterIcon/>
                  </a>
                  <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eaque molestiae mollitia quae quos odio? Sapiente, odio. Nihil impedit temporibus unde saepe culpa fugiat quas sed! Possimus ducimus veritatis error doloremque!</p>
                    </div>
                    <div className="widget w-contacts">
                      <ul className="socials socials--white">
                        {
                          social.map((social,index)=>{
                            <li key={index} className="social-item">
                              <a href={social.link} className="woox.icon">
                                {social.icon}
                              </a>
                            </li>
  
                          })
                        }
                      </ul>
                    </div>
            </div>
          </div>
      </div>
    </canvas>
    <div className="sub-footer">
    <div className="container">
          <div className="row">
            <div className="col-lg-6 col-lg-offset-3 col-md-6
            col-md-offset-3 col-sm-12 col-sm-offset-0 col-xs-12
            ">
             <span> @ All Rights Reserved</span>
             <span>
              <a href="/">The Woox</a> - ICO and cryptocurrency web3
             </span>
             <div className="logo-design">
              <img src="img/logo-fire.png" alt="" /></div>
                        
              </div>
              </div></div>
    </div>
  </footer>;
};

export default Footer;

import { Link } from "react-router-dom";
import "./../../index.css"

const ErrorPage = () => {
  return (
    <main className="h-screen w-full flex flex-col justify-center items-center">
      <section className="page_404 w-full">
        <div className="container">
          <div className="row">	
          <div className="col-sm-12 ">
          <div className="col-sm-10 col-sm-offset-1  text-center">
          <div className="four_zero_four_bg">
            <h1 className="text-center ">404</h1>
          </div>
          <div className="contant_box_404">
          <h3 className="text-2xl">
            Looks like you're lost 👀
          </h3>
          <p className="text-2xl">the page you are looking for not avaible!</p>
          
          <Link to="/" className="link_404 flex justify-center items-center mt-4 ">
            <button className="btn-primary">
              Go to Home
            </button>
          </Link>
        </div>
          </div>
          </div>
          </div>
        </div>
      </section>    
    </main>
  );
};

export default ErrorPage;


import logo from '../logo.svg';
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

const NavBar = () => {
    const[isAuthenticated, setIsAuthenticated] = useState(null);
    const[locations, setLocations] = useState({});

    let navigate = useNavigate ();

    const handleLogOut = () => {
        axios.get('http://localhost:3030/Log-Out', {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        })
            .then(r => {
                if (r.data)
                    navigate('/Log-In');
            })
            .catch(e => {
                console.log(e);
            })
    }

    const goToDebug = (l, e) => {
        setTimeout(() => {
            axios.get(l)
                .then((r) => {
                    navigate('/Debug', {state: {data: r.data}})
                })
                .catch((e) => {
                    console.log(e);
                });
        }, 1);
    }

    const getLocations = () => {
        axios.get('http://localhost:3030/Get-Locations', {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        })
            .then(r => {
                if (r.data.error)
                    throw Error(r.data.message);
                if (r.statusText != 'OK')
                    throw Error(r.statusText);
                setLocations(r.data.locations);
            })
            .catch(e => {
                console.log(e);
            })
    }

    const getAuthentication = () => {
        axios.get('http://localhost:3030/Authenticate-User', {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        })
            .then(r => {
                setIsAuthenticated(r.data.role);
                if (r.data.role == 'super_admin')
                    getLocations()
            })
            .catch(e => {
                console.log(e);
            })
    }

    useEffect(() => {
        getAuthentication();
    });

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
              <Link className="navbar-brand" to="/">
                  <img src={logo} alt="" width="30" height="24" />Debug/API
              </Link>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                      data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                      aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon" />
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                      {(isAuthenticated && isAuthenticated == 'super_admin') &&
                          <>
                              <li className="nav-item">
                                  <Link className="nav-link" to="/DashBoard">DashBoard</Link>
                              </li>
                              <li className="nav-item dropdown">
                                  <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                     data-bs-toggle="dropdown" aria-expanded="false">
                                      Locations
                                  </a>
                                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                      {locations.length > 0 && locations.map((location) => (
                                          <li>
                                              <a className="dropdown-item" href="#" onClick={(e) => goToDebug(location.location, e )}>{location.name}</a>
                                          </li>
                                      ))}
                                      <li>
                                          <hr className="dropdown-divider" />
                                      </li>
                                  </ul>
                              </li>
                          </>
                      }
                      <li className="nav-item">
                          {!isAuthenticated &&
                              <Link className="nav-link active" aria-current="page" to="/Log-In">Log-In</Link>
                          }
                          {isAuthenticated &&
                              <a className="nav-link" href="#" role="button" onClick={handleLogOut}>Log-Out</a>
                          }
                      </li>
                  </ul>
                  <form className="d-flex">
                      <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                      <button className="btn btn-outline-success" type="submit">Search</button>
                  </form>
              </div>
          </div>
      </nav>
  )
}

export default NavBar;
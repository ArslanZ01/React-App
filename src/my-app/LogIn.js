import React, {useEffect, useState} from "react"
import {Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LogIn = () => {
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const[isLoading, setIsLoading] = useState(false);
    const[error, setError] = useState(null);

    let navigate = useNavigate ();

    const getAuthentication = () => {
        axios.get('http://localhost:3030/Authenticate-User', {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        })
            .then(r => {
                if (r.data.role)
                    navigate('/DashBoard');
            })
            .catch(e => {
                console.log(e);
            })
    }

    useEffect(() => {
        getAuthentication();
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        setTimeout(() => {
            axios.post(e.target.action, {
                    email: email,
                    password: password,
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                })
                .then((r) => {
                    setIsLoading(false);
                    if (r.data.error)
                        throw Error(r.data.message);
                    if (r.statusText != 'OK')
                        throw Error(r.statusText);

                    if (r.data.role == 'super_admin')
                        navigate('/DashBoard');
                })
                .catch((e) => {
                    setError(e.message);
                    setIsLoading(false);
                });
        }, 1);
    }

    return (
        <section className="vh-100 gradient-custom">
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div className="card bg-dark text-white" style={{borderRadius: '1rem'}}>
                            <div className="card-body p-5 text-center">
                                <form className="mb-md-5 mt-md-4 pb-5" onSubmit={handleSubmit} action="http://localhost:3030/Get-User">
                                    <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                                    <p className="text-white-50 mb-5">Please enter your login and password!</p>
                                    <div className="form-outline form-white mb-4">
                                        <input type="email" className="form-control form-control-lg" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                                    </div>
                                    <div className="form-outline form-white mb-4">
                                        <input type="password" className="form-control form-control-lg" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                                    </div>
                                    {isLoading &&
                                        <button className="btn btn-outline-light btn-lg px-5" type="submit" disabled>Loading</button>
                                    }
                                    {!isLoading &&
                                        <button className="btn btn-outline-light btn-lg px-5" type="submit">Login</button>
                                    }
                                </form>
                                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                                <div>
                                    <p className="mb-0">Back to home <Link to="/" className="text-white-50 fw-bold"><i className="fas fa-arrow-left"/></Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LogIn;

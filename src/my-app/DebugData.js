import React, { useEffect, useState } from "react"
import {useLocation, useNavigate} from "react-router-dom";

function humanize(str) {
    var i, frags = str.split('_');
    for (i=0; i<frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
}

const DebugData = () => {
    const [data, setData] = useState({});
    let location = useLocation();
    let navigate = useNavigate();
    useEffect(() => {
        if (location.state == null)
            navigate('/Log-In');
        else
            setData(location.state.data);
    }, [location.state, navigate]);

    return (
        <div className="content data-table">
            {data['website'] &&
                <React.Fragment>
                    <h1>{data['website']}</h1>
                    <div className="container">
                        {data['tables'].length > 0 && data['tables'].map(data => (
                            <React.Fragment>
                                <h2 className="mb-5 mt-5" title={data.table_name}>{humanize(data.table_name)}</h2>
                                <div className="table-responsive custom-table-responsive">
                                    <table className="table custom-table">
                                        <thead>
                                        <tr>
                                            {data['table_columns'].length > 0 && data['table_columns'].map(data => (
                                                <th scope="col" title={data}>{humanize(data)}</th>
                                            ))}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {data['table_rows'].length > 0 && data['table_rows'].map(data => (
                                            <React.Fragment>
                                                <tr scope="row">
                                                    {Object.keys(data).length > 0 && Object.entries(data).map(([key,value]) => (
                                                        <td>{value}</td>
                                                    ))}
                                                </tr>
                                                <tr className="spacer">
                                                    <td colSpan="100"></td>
                                                </tr>
                                            </React.Fragment>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </React.Fragment>
            }
        </div>
    )
}

export default DebugData;

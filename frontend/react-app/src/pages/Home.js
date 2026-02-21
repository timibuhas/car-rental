import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ClientForm from "../components/ClientForm";
import AutoturismForm from "../components/AutoturismForm";
import InchirieriForm from "../components/InchirieriForm";
import "../css/Home.css";

function Home({activeUser}) {
    
    const [allCount, setAllCount] = useState({
        clientiCount: 0,
        inchirieriCount: 0,
        autoturismeCount: 0
    });
    const [showClientForm, setShowClientForm] = useState(false); // Manage add form visibility
    const [showAutoturismForm, setShowAutoturismForm] = useState(false); // Manage add form visibility
    const [showInchirieriForm, setShowInchirieriForm] = useState(false); // Manage add form visibility
    const [updateNumbers, setUpdateNumbers] = useState(0);
    useEffect(() => {

        const fetchCount = async () => {
          try {
            const response = await fetch(`http://localhost:5000/home/numbers/${activeUser.userId}`); // Replace with your API URL
            if (!response.ok) {
              throw new Error("Failed to fetch client count");
            }
            const count = await response.json();
            setAllCount(count);

          } catch (err) {
            console.warn(err.message);

          }
        };
    
        fetchCount();
      }, [updateNumbers,activeUser]); // Run only once on component mount

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Inchirieri masini</h1>
        <p>Bun venit <strong>{activeUser.username}</strong>  la sistemul de gestionare inchirieri auto!</p>
      </header>

      <section className="dashboard-overview">
        <div className="card">
          <h2>Masini disponibile</h2>
          <p>{allCount.autoturismeCount}</p>
          <Link to="/autoturisme" className="btn">Gestioneaza Masini</Link>
        </div>
        <div className="card">
          <h2>Inchirieri active</h2>
          <p>{allCount.inchirieriCount}</p>
          <Link to="/inchirieri" className="btn">View Bookings</Link>
        </div>
        <div className="card">
          <h2>Clienti</h2>
          <p>{allCount.clientiCount}</p>
          <Link to="/clienti" className="btn">Gestioneaza Clienti</Link>
        </div>
      </section>

      <section className="dashboard-navigation">
        <h2>Actiuni rapide</h2>
        <div className="quick-links">
        <button type="button" className="green-button" onClick={()=>setShowAutoturismForm(true)}>Adauga autoturism</button>
        <button type="button" className="green-button" onClick={()=>setShowInchirieriForm(true)}>Adauga inchiriere</button>
        <button type="button" className="green-button" onClick={()=>setShowClientForm(true)}>Adauga client</button>
        </div>
      </section>

      {showAutoturismForm && (
        <AutoturismForm
          onSubmit={()=>setUpdateNumbers(updateNumbers+1)}
          onClose={() => setShowAutoturismForm(false)}
        />
      )}

      {showClientForm && (
        <ClientForm
          onSubmit={()=>setUpdateNumbers(updateNumbers+1)}
          onClose={() => setShowClientForm(false)}
        />
      )}

      {showInchirieriForm && (
        <InchirieriForm
          activeUser={activeUser}
          onClose={() => setShowInchirieriForm(false)}
          onSubmit={()=>setUpdateNumbers(updateNumbers+1)}
        />
      )}


    </div>
  );
}

export default Home;

import "../style/Home.css";
import firebase from "./firebase";

import React, { useState, useEffect } from "react";

function Home({ selectedSources, setSelectedSources }) {
  const [sources, setsources] = useState([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    const storedSources = JSON.parse(localStorage.getItem("selectedSources"));
    setSelectedSources(storedSources);
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedSources", JSON.stringify(selectedSources));
    const refs = selectedSources.map((source) =>
      firebase
        .firestore()
        .collection("Sources")
        .doc(source)
        .collection("Articles")
    );
    getsources(refs);
  }, [selectedSources]);

  function getsources(refs) {
    setloading(true);
    const items = [];
    Promise.all(refs.map((ref) => ref.get())).then((snapshots) => {
      snapshots.forEach((snapshot) => {
        snapshot.forEach((doc) => {
          items.push(doc.data());
        });
      });
      setsources(items);
      setloading(false);
    });
  }

  const handleHeaderClick = (link) => {
    window.open(link, "_blank");
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (selectedSources.length === 0) {
    return (
      <div className="center">
        <h1>You have not selected any sources</h1>
        <h2>
          Click on "Select sources" to display your alternatives and select the
          preferred source/sources
        </h2>
      </div>
    );
  }

  return (
    <div>
      <div className="center">
        {sources.map((art) => (
          <div className="border" key={art.id}>
            <h3 className="header" onClick={() => handleHeaderClick(art.link)}>
              {art.header} - {art.source}
            </h3>
            <p className="bodyText">{art.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;

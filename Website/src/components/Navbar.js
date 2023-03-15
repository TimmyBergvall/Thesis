import "../style/Navbar.css"
import firebase from './firebase';

import React, { 
    useState, 
    useEffect 
} from 'react';




function Navbar({selectedSources, setSelectedSources}){
    const [showSource, setShowSource] = useState(false);
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chosenSource, setChosenSource] = useState("");
    const ref = firebase.firestore().collection("Sources");

    useEffect(() => {
    function getTheSources() {
        const ref = firebase.firestore().collection("Sources");
        ref.onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) =>{
                items.push(doc.id);
            });
            setSelectedSources(items);
    });
    }
    getTheSources();
    }, []);

    useEffect(() => {
        localStorage.setItem("selectedSources", JSON.stringify(selectedSources));
    }, [selectedSources]);
    

    useEffect(() =>{
        getSources();
    }, []);

    const handleSourceClick = (source) => {
        if (selectedSources.includes(source)) {
            setSelectedSources(selectedSources.filter(s => s !== source));
        } else {
            setSelectedSources([...selectedSources, source]);
        }
    };
    
    function getSources(){
        setLoading(true);
        ref.onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) =>{
                items.push(doc.id);
            });
            setSources(items);
            setLoading(false);
        });
    }  

    if(loading){
        return <h1>Loading...</h1>
    }

    return (
        <div>
            <div className="center">
                <div>    
                    <h2 className="shadow" onClick={() => setShowSource(!showSource)}>Select sources:</h2>
                    {showSource && (
                        <div>
                            {sources.map((source) => (
                                <div key={source}>
                                    <h4 
                                    className={selectedSources.includes(source) ? "selected" : ""}
                                    onClick={() => {
                                        handleSourceClick(source);
                                        setChosenSource(source);
                                    }}> {source} </h4>
                                </div>
                            ))}
                        </div>  
                    )}
                </div>    
            </div> 
        </div>  
    );
};
export default Navbar;


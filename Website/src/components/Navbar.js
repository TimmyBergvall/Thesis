import "../style/Navbar.css"
import firebase from './firebase';

import React, { 
    useState, 
    useEffect 
} from 'react';




function Navbar(){
  
    const [showSource, setShowSource] = useState(false);
    const [selectedSources, setSelectedSources] = useState([]);

    const ref = firebase.firestore().collection("Sources");

    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(false);

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
    
    useEffect(() =>{
        getSources();
    }, []);
    
    if(loading){
        return <h1>Loading...</h1>
    }

    const handleSourceClick = (source) => {
        if (selectedSources.includes(source)) {
            setSelectedSources(selectedSources.filter(s => s !== source));
        } else {
            setSelectedSources([...selectedSources, source]);
        }
    };

    return (
        <div>
            <div className="center">
                <div>    
                    <h2 className="shadow" onClick={() => setShowSource(!showSource)}>Header</h2>
                    {showSource && (
                        <div>
                            <h3>Select Source:</h3>
                            {sources.map((source) => (
                                <div key={source}>
                                    <h4 onClick={() => handleSourceClick(source)}>
                                        {source}
                                    </h4>
                                </div>
                            ))}
                        </div>  
                    )}
                </div>    
            </div> 
            <div>
                <h3>Selected sources:</h3>
                {selectedSources.map((source) => (
                    <div key={source}>
                        <h4>{source}</h4>
                    </div>
                ))}
            </div>
        </div>  
    );
};
export default Navbar;


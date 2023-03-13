import "../style/Navbar.css"
import firebase from './firebase';

import React, { 
    useState, 
    useEffect 
} from 'react';




function Navbar(){
  
    const [showSource, setShowSource] = useState(false);

    const [selectSource, setSelectSource] = useState(false);

    const ref = firebase.firestore().collection("Articles")

    const [Articles, setarticles] = useState([]);
    const [loading, setloading] = useState(false);

    function getarticles(){
        setloading(true)
        ref.onSnapshot((querySnapshort) => {
            const items = []
            querySnapshort.forEach((doc) =>{
                items.push(doc.data())
            })
            setarticles(items)
            setloading(false)
    
        })
      }
    
      useEffect(() =>{
        getarticles()
      }, [])
    
      if(loading){
        return <h1>Loading...</h1>
    }


    return (
        <div>
        <div className="center">
        <div>
            
      <h2 className="shadow" onClick={() => setShowSource(!showSource)}>Header</h2>
      {showSource && (
        <div>
        <h3>Select Source:</h3>
        <div/>
        {Articles.map((art) => (
            <div>
                
                <h4 onClick={() => setSelectSource(!selectSource)}>{art.source}</h4>

            </div>
        ))}

      
    </div>  
    )}</div>    
    </div> 
        </div>  
    );
};
  
export default Navbar;
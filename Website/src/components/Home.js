import "../style/Home.css"
import firebase from './firebase';


import React, { 
    useState, 
    useEffect 
} from 'react';




function Home(){
//Firebase
const [sources, setsources] = useState([]);
const [loading, setloading] = useState(false);

const handleHeaderClick = (link) => {
    window.open(link, "_blank");
    };

    const ref = firebase.firestore().collection("Sources").doc("svt").collection("Articles");
    console.log(ref);

  function getsources(){
    setloading(true)
    ref.onSnapshot((querySnapshort) => {
        const items = []
        querySnapshort.forEach((doc) =>{
            items.push(doc.data())
        })
        setsources(items)
        setloading(false)

    })
  }

  useEffect(() =>{
    getsources()
  }, [])

  if(loading){
    return <h1>Loading...</h1>
}

    return (
        <div>
        <div className="center">
            {sources.map((art) => (
        
            <div className="border" key={art.id}>
                <h3 className="header" onClick={() => handleHeaderClick(art.link)}>
                    {art.header}
                </h3>
                <p className="bodyText">{art.text}</p>
            
            </div>

            ))}
            
        </div>        
        </div>
        
    );
};
  
export default Home;